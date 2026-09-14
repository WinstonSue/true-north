import type {
  AiMessagePartVo,
  AiTextPartVo,
  MessageVo,
  PutRuntimeSettingsRequestVo,
  RuntimeAgentVo,
  RuntimeSelectionVo,
  RuntimeSettingsVo,
} from '@true-north/vo';
import { AiPlatformError } from '../ai-error';
import { emitStream } from '../conversation/stream-bus';
import { getAdapter, requireAdapter } from './adapters';
import { mcpUrl } from './mcp/loopback-server';
import { resolvePreferredAgent } from './preferred-agent';
import {
  currentDefaultRuntimeId,
  invalidateProbeCache,
  probeAllAgents,
  toRuntimeAgentManagementVo,
  toRuntimeAgentVo,
} from './probe';
import { agentDef } from './registry';
import { normalizePathOverride } from './settings-schema';
import { readRuntimeId, readRuntimeSettings, writeRuntimeId, writeRuntimeSettings } from './settings-store';
import { unexpectedRuntimeFailure } from './runtime-exit';
import { bindStreamSession, unbindStreamSession } from './stream-session';
import type { RuntimeProbeResult, RuntimeSpawnInput, StreamSessionContext } from './types';
import { conversationWorkspaceDir } from './workspace';

function cloneParts(parts: AiMessagePartVo[]): AiMessagePartVo[] {
  return parts.map((part) => ({ ...part }));
}

function concatTextParts(parts: AiMessagePartVo[]): string {
  return parts
    .filter((part): part is AiTextPartVo => part.type === 'text')
    .map((part) => part.text || '')
    .join('');
}

function collectLinks(parts: AiMessagePartVo[]): NonNullable<AiTextPartVo['entityLinks']> {
  const links: NonNullable<AiTextPartVo['entityLinks']> = [];
  for (const part of parts) {
    if (part.type === 'text') {
      links.push(...(part.entityLinks || []));
    }
  }
  return links;
}

function pickGrownText(current: string, incoming: string): string {
  if (current.startsWith(incoming) || incoming.startsWith(current)) {
    return current.length >= incoming.length ? current : incoming;
  }
  return current.length >= incoming.length ? current : incoming;
}

function mergeParts(current: AiMessagePartVo[], incoming: AiMessagePartVo[]): AiMessagePartVo[] {
  const currentText = concatTextParts(current);
  const incomingText = concatTextParts(incoming);
  const grown = pickGrownText(currentText, incomingText);
  const useCurrentLinks = grown === currentText && grown !== incomingText;
  const entityLinks = useCurrentLinks ? collectLinks(current) : collectLinks(incoming);
  const textPart: AiTextPartVo = entityLinks.length
    ? { type: 'text', text: grown, entityLinks }
    : { type: 'text', text: grown };

  const next: AiMessagePartVo[] = [];
  let insertedText = false;
  for (const part of incoming) {
    if (part.type === 'text') {
      if (!insertedText) {
        next.push(textPart);
        insertedText = true;
      }
    } else {
      next.push({ ...part });
    }
  }
  if (!insertedText && grown) {
    next.unshift(textPart);
  }
  return next;
}

function ensureTrailingText(parts: AiMessagePartVo[], text: string): AiMessagePartVo[] {
  const next = cloneParts(parts);
  const last = next[next.length - 1];
  if (last && last.type === 'text') {
    next[next.length - 1] = { ...last, text };
    return next;
  }
  next.push({ type: 'text', text });
  return next;
}

function appendDelta(parts: AiMessagePartVo[], delta: string): AiMessagePartVo[] {
  const next = cloneParts(parts);
  const last = next[next.length - 1];
  if (last && last.type === 'text') {
    next[next.length - 1] = { ...last, text: `${last.text || ''}${delta}` };
    return next;
  }
  next.push({ type: 'text', text: delta });
  return next;
}

function enqueueLock() {
  let chain = Promise.resolve();
  return <T,>(task: () => Promise<T> | T): Promise<T> => {
    const run = chain.then(task, task);
    chain = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  };
}

export { resolvePreferredAgent };

export class RuntimeService {
  async listAgents(): Promise<RuntimeAgentVo[]> {
    const probes = await probeAllAgents();
    return probes.filter((item) => item.enabled).map(toRuntimeAgentVo);
  }

  getSelection(): RuntimeSelectionVo {
    return { runtimeId: currentDefaultRuntimeId() };
  }

  putSelection(runtimeId: string): RuntimeSelectionVo {
    const def = agentDef(runtimeId);
    if (!def) {
      throw AiPlatformError.agentUnavailable(`未知编码 Agent: ${runtimeId}`);
    }
    const settings = readRuntimeSettings();
    if (settings.agents[def.id] && settings.agents[def.id].enabled === false) {
      throw AiPlatformError.agentUnavailable(`${def.name} 已在设置中关闭`);
    }
    return { runtimeId: writeRuntimeId(def.id) };
  }

  async getSettings(): Promise<RuntimeSettingsVo> {
    const probes = await probeAllAgents();
    const defaultRuntimeId = currentDefaultRuntimeId();
    return {
      defaultRuntimeId,
      agents: probes.map((item) => toRuntimeAgentManagementVo(item, defaultRuntimeId)),
    };
  }

  async putSettings(body: PutRuntimeSettingsRequestVo): Promise<RuntimeSettingsVo> {
    const current = readRuntimeSettings();
    if ('defaultRuntimeId' in body) {
      const nextDefault = body.defaultRuntimeId;
      if (nextDefault !== undefined && nextDefault !== null && !agentDef(nextDefault)) {
        throw AiPlatformError.agentUnavailable(`未知编码 Agent: ${nextDefault}`);
      }
      current.defaultRuntimeId = nextDefault?.trim() ? nextDefault.trim() : null;
    }
    for (const patch of body.agents || []) {
      const def = agentDef(patch.id);
      if (!def) throw AiPlatformError.agentUnavailable(`未知编码 Agent: ${patch.id}`);
      const prev = current.agents[def.id] || { enabled: true, pathOverride: null };
      if (typeof patch.enabled === 'boolean') prev.enabled = patch.enabled;
      if ('pathOverride' in patch) {
        const normalized = normalizePathOverride(patch.pathOverride);
        if (normalized.ok === false) throw AiPlatformError.internal(normalized.message);
        prev.pathOverride = normalized.value;
      }
      current.agents[def.id] = prev;
    }
    writeRuntimeSettings(current);
    invalidateProbeCache();

    let settings = await this.getSettings();
    const currentDefault = settings.agents.find((item) => item.id === settings.defaultRuntimeId);
    if (currentDefault && !currentDefault.enabled) {
      const fallback = settings.agents.find((item) => item.enabled && item.available);
      writeRuntimeId(fallback?.id || null);
      invalidateProbeCache();
      settings = await this.getSettings();
    }
    return settings;
  }

  async resolveForSend(preferredRuntimeId?: string | null): Promise<RuntimeProbeResult> {
    const probes = (await probeAllAgents()).filter((item) => item.enabled);
    const selected = resolvePreferredAgent(probes, preferredRuntimeId ?? readRuntimeId());
    if (!selected) {
      throw AiPlatformError.agentUnavailable('没有可用的编码 Agent');
    }
    if (!selected.resolvedPath) {
      throw AiPlatformError.agentUnavailable(selected.unavailableReason || '未安装');
    }
    if (!selected.authenticated) {
      throw AiPlatformError.agentUnauthenticated(selected.unavailableReason || '未登录');
    }
    if (!selected.available) {
      throw AiPlatformError.agentUnavailable(selected.unavailableReason || '当前选择不可用');
    }
    return selected;
  }

  async runChat(input: {
    streamId: string;
    conversationId: string;
    assistantId: string;
    prompt: string;
    resumeThreadId?: string;
    preferredRuntimeId?: string | null;
    signal: AbortSignal;
    persistParts: (parts: AiMessagePartVo[]) => Promise<MessageVo>;
  }): Promise<{ message: MessageVo; threadId?: string; runtimeId: string }> {
    const selected = await this.resolveForSend(input.preferredRuntimeId);
    const adapter = getAdapter(selected.id);
    const def = agentDef(selected.id);
    if (!adapter || !def || !selected.resolvedPath) {
      throw AiPlatformError.agentUnavailable('当前选择不可用');
    }

    const enqueue = enqueueLock();
    let parts: AiMessagePartVo[] = [{ type: 'text', text: '' }];
    const ctx: StreamSessionContext = {
      streamId: input.streamId,
      conversationId: input.conversationId,
      assistantId: input.assistantId,
      parts,
      persistParts: async (incoming: AiMessagePartVo[]) => input.persistParts(incoming),
    };

    const persistCanonical = async (next: AiMessagePartVo[]) => {
      parts = next;
      ctx.parts = parts;
      return input.persistParts(parts);
    };
    ctx.persistParts = (incoming: AiMessagePartVo[]) =>
      enqueue(() => persistCanonical(mergeParts(parts, incoming)));
    await ctx.persistParts(ctx.parts);
    bindStreamSession(ctx);

    let threadId = input.resumeThreadId;
    const spawnInput: RuntimeSpawnInput = {
      streamId: input.streamId,
      def,
      binPath: selected.resolvedPath,
      workspaceDir: conversationWorkspaceDir(input.conversationId),
      mcpUrl: mcpUrl(input.streamId),
      prompt: input.prompt,
      resumeThreadId: input.resumeThreadId,
      signal: input.signal,
      onDelta: (delta) => {
        void enqueue(() => {
          parts = appendDelta(parts, delta);
          ctx.parts = parts;
          emitStream({ streamId: input.streamId, event: 'delta', delta });
        });
      },
      onThreadId: (id) => {
        threadId = id;
      },
    };

    let spawnResult: Awaited<ReturnType<typeof adapter.spawn>>;
    try {
      spawnResult = await adapter.spawn(spawnInput);
    } finally {
      unbindStreamSession(input.streamId);
    }
    threadId = spawnResult.threadId || threadId;
    await enqueue(() => undefined);

    if (input.signal.aborted) {
      const message = await enqueue(() => {
        const current = concatTextParts(parts);
        return persistCanonical(
          ensureTrailingText(parts, current.trim() ? `${current}\n\n（已停止生成）` : '（已停止生成）')
        );
      });
      return { message, threadId, runtimeId: def.id };
    }

    const runtimeFailure = unexpectedRuntimeFailure(spawnResult.exitCode, spawnResult.stderr);
    if (runtimeFailure) {
      throw AiPlatformError.internal(runtimeFailure);
    }

    const message = await enqueue(() => {
      const hasContent = parts.some((part) => {
        if (part.type === 'text') return Boolean(part.text?.trim());
        return part.type === 'workspace' || part.type === 'tool';
      });
      return persistCanonical(hasContent ? parts : ensureTrailingText(parts, '（模型未返回内容）'));
    });
    return { message, threadId, runtimeId: def.id };
  }
}

export const runtimeService = new RuntimeService();
export { requireAdapter };
