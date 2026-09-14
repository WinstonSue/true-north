import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { isSchemaSql, sanitizeTraceValue, summarizeAiStreamRequest, summarizeAiStreamResponse, summarizeSql } from './sanitize.ts';
import type { TraceEntry, TraceSpan, TraceSpanKind } from './types.ts';

const RING_SIZE = 200;

type AlsStore = {
  ipcId: string;
  streamId?: string;
};

type SpanEnd = {
  durationMs?: number;
  detail?: unknown;
  error?: string;
  summary?: string;
};

export type AiStreamTraceEvent =
  | { streamId: string; event: 'delta'; chars: number }
  | { streamId: string; event: 'message'; partKinds: string[] }
  | { streamId: string; event: 'done'; stopped?: boolean }
  | { streamId: string; event: 'error'; code?: string };

const als = new AsyncLocalStorage<AlsStore>();
const entries: TraceEntry[] = [];
const byId = new Map<string, TraceEntry>();
const streamToIpc = new Map<string, string>();
const streamDeltaSpans = new Map<string, { spanId: string; count: number; chars: number }>();
const listeners = new Set<(snapshot: TraceEntry[]) => void>();
let emitTimer: ReturnType<typeof setTimeout> | null = null;

function tracingEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.TN_DEV_PROFILE !== 'product';
}

export function isDevTraceEnabled(): boolean {
  return tracingEnabled();
}

export function snapshotDevTrace(): TraceEntry[] {
  return entries.map(cloneEntry);
}

export function clearDevTrace(): void {
  entries.splice(0, entries.length);
  byId.clear();
  streamToIpc.clear();
  streamDeltaSpans.clear();
  emit();
}

export function subscribeDevTrace(listener: (snapshot: TraceEntry[]) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function runRestTrace<T>(
  req: { method?: string; path?: string; payload?: unknown },
  run: () => Promise<T>
): Promise<T> {
  if (!tracingEnabled()) return run();
  const id = randomUUID();
  const startedAt = Date.now();
  const path = String(req?.path || '');
  const isStreamPath = path.includes('/messages/stream');
  const entry: TraceEntry = {
    id,
    kind: 'ipc',
    startedAt,
    open: true,
    method: String(req?.method || 'GET').toUpperCase(),
    path,
    params: sanitizeTraceValue(isStreamPath ? summarizeAiStreamRequest(req?.payload) : req?.payload),
    spans: [],
  };
  pushEntry(entry);

  try {
    const result = await als.run({ ipcId: id }, run);
    entry.durationMs = Date.now() - startedAt;
    entry.response = sanitizeTraceValue(isStreamPath ? summarizeAiStreamResponse(result) : result);
    const streamId = extractStreamId(entry.path, result);
    const failed = isFailedResponse(result);
    entry.ok = !failed;
    if (failed) entry.error = responseError(result);
    if (streamId) {
      entry.streamId = streamId;
      streamToIpc.set(streamId, id);
      entry.open = true;
    } else {
      entry.open = false;
    }
    emit();
    return result;
  } catch (error) {
    entry.durationMs = Date.now() - startedAt;
    entry.open = false;
    entry.ok = false;
    entry.error = error instanceof Error ? error.message : String(error);
    emit();
    throw error;
  }
}

export type TraceSpanCtl = {
  setDetail: (detail: unknown) => void;
  setSummary: (summary: string) => void;
};

export async function traceExternal<T>(
  input: {
    kind: TraceSpanKind;
    summary: string;
    streamId?: string;
    detail?: unknown;
  },
  run: (span: TraceSpanCtl) => Promise<T>
): Promise<T> {
  if (!tracingEnabled()) return run({ setDetail() {}, setSummary() {} });
  const startedAt = Date.now();
  const span: TraceSpan = {
    id: randomUUID(),
    kind: input.kind,
    startedAt,
    summary: input.summary,
    detail: input.detail === undefined ? undefined : sanitizeTraceValue(input.detail),
  };
  const parent = attachSpan(span, input.streamId);
  const store: AlsStore | undefined = parent
    ? { ipcId: parent.id, streamId: input.streamId || parent.streamId }
    : input.streamId
      ? { ipcId: '', streamId: input.streamId }
      : als.getStore();
  const ctl: TraceSpanCtl = {
    setDetail: (detail) => {
      span.detail = sanitizeTraceValue(detail);
    },
    setSummary: (summary) => {
      span.summary = summary;
    },
  };

  const execute = async () => {
    try {
      const result = await run(ctl);
      finishSpan(span, parent, {
        durationMs: Date.now() - startedAt,
        detail: span.detail,
        summary: span.summary,
      });
      return result;
    } catch (error) {
      finishSpan(span, parent, {
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        detail: span.detail,
        summary: span.summary,
      });
      throw error;
    }
  };

  if (store?.ipcId) return als.run(store, execute);
  return execute();
}

export function recordSql(input: {
  query: string;
  parameters?: unknown[];
  error?: string;
  durationMs?: number;
}): void {
  if (!tracingEnabled() || isSchemaSql(input.query)) return;
  const summary = summarizeSql(input.query);
  const parent = findParent(als.getStore()?.streamId);
  if (input.error || input.durationMs != null) {
    const last = parent
      ? [...parent.spans].reverse().find((span) => span.kind === 'sql' && span.summary === summary)
      : undefined;
    if (last && parent) {
      if (input.durationMs != null) last.durationMs = input.durationMs;
      if (input.error) last.error = input.error;
      parent.spans = parent.spans.map((span) => (span.id === last.id ? { ...last } : span));
      emit();
      return;
    }
    const orphan = [...entries]
      .reverse()
      .find((entry) => entry.kind === 'sql' && entry.summary === summary);
    if (orphan) {
      const span = orphan.spans[0];
      if (span) {
        if (input.durationMs != null) span.durationMs = input.durationMs;
        if (input.error) span.error = input.error;
        orphan.spans = [{ ...span }];
      }
      if (input.durationMs != null) orphan.durationMs = input.durationMs;
      if (input.error) {
        orphan.error = input.error;
        orphan.ok = false;
      }
      orphan.open = false;
      emit();
      return;
    }
  }
  const span: TraceSpan = {
    id: randomUUID(),
    kind: 'sql',
    startedAt: Date.now() - (input.durationMs || 0),
    durationMs: input.durationMs,
    summary,
    detail: sanitizeTraceValue({
      query: input.query,
      parameters: input.parameters,
    }),
    error: input.error,
  };
  attachSpan(span, als.getStore()?.streamId);
}

export function bindStreamToCurrentTrace(streamId: string, conversationId?: string): void {
  if (!tracingEnabled() || !streamId.trim()) return;
  const store = als.getStore();
  if (store?.ipcId) {
    streamToIpc.set(streamId, store.ipcId);
    const entry = byId.get(store.ipcId);
    if (entry) {
      entry.streamId = streamId;
      if (conversationId) entry.conversationId = conversationId;
      entry.open = true;
    }
  }
  const parent = findParent(streamId);
  if (parent && conversationId && !parent.conversationId) {
    parent.conversationId = conversationId;
  }
  if (parent?.spans.some((span) => span.kind === 'stream' && span.summary === '开始生成')) {
    emit();
    return;
  }
  attachSpan(
    {
      id: randomUUID(),
      kind: 'stream',
      startedAt: Date.now(),
      summary: '开始生成',
      detail: sanitizeTraceValue({ conversationId, streamId }),
    },
    streamId
  );
}

export function recordAiStreamEvent(input: AiStreamTraceEvent): void {
  if (!tracingEnabled() || !input.streamId.trim()) return;
  const parent = findParent(input.streamId);

  if (input.event === 'delta') {
    const chars = Number.isFinite(input.chars) ? Math.max(0, input.chars) : 0;
    const existing = streamDeltaSpans.get(input.streamId);
    if (existing && parent) {
      const span = parent.spans.find((item) => item.id === existing.spanId);
      if (span) {
        existing.count += 1;
        existing.chars += chars;
        span.summary = `输出 ${existing.count} 次 · ${existing.chars} 字`;
        span.detail = sanitizeTraceValue({ deltaCount: existing.count, deltaChars: existing.chars });
        span.durationMs = Date.now() - span.startedAt;
        parent.spans = parent.spans.map((item) => (item.id === span.id ? { ...span } : item));
        emit();
        return;
      }
    }
    const span: TraceSpan = {
      id: randomUUID(),
      kind: 'stream',
      startedAt: Date.now(),
      summary: `输出 1 次 · ${chars} 字`,
      detail: sanitizeTraceValue({ deltaCount: 1, deltaChars: chars }),
    };
    attachSpan(span, input.streamId);
    streamDeltaSpans.set(input.streamId, { spanId: span.id, count: 1, chars });
    return;
  }

  if (input.event === 'message') {
    const toolCalls = (input.partKinds || []).filter((kind) => kind === 'tool').length;
    if (!toolCalls) return;
    attachSpan(
      {
        id: randomUUID(),
        kind: 'stream',
        startedAt: Date.now(),
        durationMs: 0,
        summary: `工具调用 ${toolCalls} 次`,
        detail: sanitizeTraceValue({ partKinds: input.partKinds, toolCalls }),
      },
      input.streamId
    );
    return;
  }

  streamDeltaSpans.delete(input.streamId);
  const failed = input.event === 'error';
  const summary = failed ? '失败' : input.stopped ? '已停止' : '已完成';
  attachSpan(
    {
      id: randomUUID(),
      kind: 'stream',
      startedAt: Date.now(),
      durationMs: 0,
      summary,
      detail: sanitizeTraceValue(failed ? { code: input.code } : { stopped: Boolean(input.stopped) }),
      error: failed ? input.code || 'INTERNAL' : undefined,
    },
    input.streamId
  );
  if (failed) {
    const ipcId = streamToIpc.get(input.streamId);
    const entry = ipcId ? byId.get(ipcId) : parent;
    if (entry) {
      entry.ok = false;
      entry.error = input.code || 'INTERNAL';
    }
  }
  closeStream(input.streamId);
}

function pushEntry(entry: TraceEntry): void {
  entries.push(entry);
  byId.set(entry.id, entry);
  while (entries.length > RING_SIZE) {
    const removed = entries.shift();
    if (!removed) break;
    byId.delete(removed.id);
    if (removed.streamId && streamToIpc.get(removed.streamId) === removed.id) {
      streamToIpc.delete(removed.streamId);
    }
  }
  emit();
}

function attachSpan(span: TraceSpan, streamId?: string): TraceEntry | undefined {
  const parent = findParent(streamId);
  if (parent) {
    parent.spans = [...parent.spans, span];
    if (streamId && !parent.streamId) {
      parent.streamId = streamId;
      streamToIpc.set(streamId, parent.id);
    }
    emit();
    return parent;
  }
  const orphan: TraceEntry = {
    id: span.id,
    kind: span.kind,
    startedAt: span.startedAt,
    durationMs: span.durationMs,
    open: span.durationMs == null,
    ok: !span.error,
    error: span.error,
    summary: span.summary,
    streamId,
    spans: [span],
  };
  pushEntry(orphan);
  return orphan;
}

function finishSpan(span: TraceSpan, parent: TraceEntry | undefined, end: SpanEnd): void {
  span.durationMs = end.durationMs;
  if (end.detail !== undefined) span.detail = end.detail;
  if (end.error) span.error = end.error;
  if (end.summary) span.summary = end.summary;
  if (parent) {
    parent.spans = parent.spans.map((item) => (item.id === span.id ? { ...span } : item));
    if (parent.kind !== 'ipc') {
      parent.durationMs = span.durationMs;
      parent.open = false;
      parent.ok = !span.error;
      parent.error = span.error;
      parent.summary = span.summary;
    }
  }
  emit();
}

function findParent(streamId?: string): TraceEntry | undefined {
  const fromAls = als.getStore()?.ipcId;
  if (fromAls) return byId.get(fromAls);
  const fromStream = streamId || als.getStore()?.streamId;
  if (fromStream) {
    const ipcId = streamToIpc.get(fromStream);
    if (ipcId) return byId.get(ipcId);
  }
  return undefined;
}

function closeStream(streamId?: string): void {
  if (!streamId) {
    const ipcId = als.getStore()?.ipcId;
    const entry = ipcId ? byId.get(ipcId) : undefined;
    if (entry?.open) {
      entry.open = false;
      emit();
    }
    return;
  }
  const ipcId = streamToIpc.get(streamId);
  const entry = ipcId ? byId.get(ipcId) : undefined;
  if (entry?.open) {
    entry.open = false;
    emit();
  }
}

function extractStreamId(path: string | undefined, result: unknown): string | undefined {
  if (result && typeof result === 'object') {
    const record = result as { data?: { streamId?: unknown }; streamId?: unknown };
    const fromData = record.data?.streamId;
    if (typeof fromData === 'string' && fromData.trim()) return fromData.trim();
    if (typeof record.streamId === 'string' && record.streamId.trim()) return record.streamId.trim();
  }
  if (path && path.includes('/messages/stream')) return undefined;
  return undefined;
}

function isFailedResponse(result: unknown): boolean {
  if (!result || typeof result !== 'object') return false;
  const code = (result as { code?: unknown }).code;
  return typeof code === 'number' && code !== 200;
}

function responseError(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') return undefined;
  const message = (result as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

function cloneEntry(entry: TraceEntry): TraceEntry {
  return {
    ...entry,
    spans: entry.spans.map((span) => ({ ...span })),
  };
}

function emit(): void {
  if (!listeners.size) return;
  if (emitTimer) return;
  emitTimer = setTimeout(() => {
    emitTimer = null;
    const snapshot = snapshotDevTrace();
    for (const listener of listeners) listener(snapshot);
  }, 40);
}
