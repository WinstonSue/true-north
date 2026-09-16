import type { TraceEntry, TraceEntryKind } from '../types';

export type TraceStatus = 'pending' | 'ok' | 'error';

export const STATUS_FILTER_OPTIONS: { value: TraceStatus; label: string }[] = [
  { value: 'pending', label: '进行中' },
  { value: 'ok', label: '成功' },
  { value: 'error', label: '失败' },
];

const KIND_LABELS: Record<TraceEntryKind, string> = {
  ipc: 'IPC',
  sql: 'SQL',
  spawn: 'spawn',
  mcp: 'MCP',
  stream: 'stream',
};

export function entryStatus(entry: TraceEntry): TraceStatus {
  if (entry.open) return 'pending';
  if (entry.ok === false || entry.error) return 'error';
  return 'ok';
}

export function requestTypeOf(entry: TraceEntry): string {
  if (entry.kind === 'ipc') {
    const method = entry.method?.trim().toUpperCase();
    return method || 'IPC';
  }
  return entry.kind;
}

export function requestTypeLabel(type: string): string {
  return KIND_LABELS[type as TraceEntryKind] ?? type;
}

export function collectTypeOptions(entries: TraceEntry[]): { value: string; label: string }[] {
  const seen = new Set<string>();
  const options: { value: string; label: string }[] = [];
  for (const entry of entries) {
    const type = requestTypeOf(entry);
    if (seen.has(type)) continue;
    seen.add(type);
    options.push({ value: type, label: requestTypeLabel(type) });
  }
  return options.sort((a, b) => a.label.localeCompare(b.label, 'en'));
}

export function filterEntries(
  entries: TraceEntry[],
  filters: { type?: string; status?: TraceStatus | 'all' },
): TraceEntry[] {
  const type = filters.type && filters.type !== 'all' ? filters.type : undefined;
  const status = filters.status && filters.status !== 'all' ? filters.status : undefined;
  if (!type && !status) return entries;
  return entries.filter((entry) => {
    if (type && requestTypeOf(entry) !== type) return false;
    if (status && entryStatus(entry) !== status) return false;
    return true;
  });
}
