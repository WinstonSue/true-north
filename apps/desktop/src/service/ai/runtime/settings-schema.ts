import path from 'path';

export type AgentSettingsRecord = {
  enabled: boolean;
  pathOverride: string | null;
};

export type RuntimeSettingsRecord = {
  defaultRuntimeId: string | null;
  agents: Record<string, AgentSettingsRecord>;
};

export function defaultAgentSettings(): AgentSettingsRecord {
  return { enabled: true, pathOverride: null };
}

export function emptySettings(): RuntimeSettingsRecord {
  return { defaultRuntimeId: null, agents: {} };
}

export function parseLegacySelection(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const runtimeId = (raw as { runtimeId?: unknown }).runtimeId;
  return typeof runtimeId === 'string' && runtimeId.trim() ? runtimeId.trim() : null;
}

function parseAgentSettings(raw: unknown): AgentSettingsRecord {
  const next = defaultAgentSettings();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return next;
  const record = raw as { enabled?: unknown; pathOverride?: unknown };
  if (typeof record.enabled === 'boolean') next.enabled = record.enabled;
  const override = normalizePathOverride(record.pathOverride);
  if (override.ok) next.pathOverride = override.value;
  return next;
}

export function parseRuntimeSettings(raw: unknown, knownIds: readonly string[]): RuntimeSettingsRecord {
  const next = emptySettings();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return hydrateKnownAgents(next, knownIds);
  }
  const record = raw as {
    defaultRuntimeId?: unknown;
    agents?: unknown;
  };
  if (typeof record.defaultRuntimeId === 'string' && record.defaultRuntimeId.trim()) {
    next.defaultRuntimeId = record.defaultRuntimeId.trim();
  } else if (record.defaultRuntimeId === null) {
    next.defaultRuntimeId = null;
  }
  if (record.agents && typeof record.agents === 'object' && !Array.isArray(record.agents)) {
    for (const [id, value] of Object.entries(record.agents as Record<string, unknown>)) {
      if (!id.trim()) continue;
      next.agents[id] = parseAgentSettings(value);
    }
  }
  return hydrateKnownAgents(next, knownIds);
}

function hydrateKnownAgents(
  settings: RuntimeSettingsRecord,
  knownIds: readonly string[]
): RuntimeSettingsRecord {
  for (const id of knownIds) {
    if (!settings.agents[id]) settings.agents[id] = defaultAgentSettings();
  }
  return settings;
}

export function normalizePathOverride(
  value: unknown
): { ok: true; value: string | null } | { ok: false; message: string } {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false, message: '覆盖路径无效' };
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, value: null };
  if (!path.isAbsolute(trimmed)) return { ok: false, message: '覆盖路径必须是可执行文件的绝对路径' };
  return { ok: true, value: trimmed };
}

export function agentSettingsOf(
  settings: RuntimeSettingsRecord,
  id: string
): AgentSettingsRecord {
  return settings.agents[id] || defaultAgentSettings();
}
