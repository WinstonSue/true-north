import type { RuntimeProbeResult } from './types';

export const FACTORY_DEFAULT_RUNTIME_ID = 'cursor-agent';

export function resolveDefaultRuntimeId(savedId?: string | null): string {
  const trimmed = savedId?.trim();
  return trimmed || FACTORY_DEFAULT_RUNTIME_ID;
}

export function resolvePreferredAgent(
  probes: RuntimeProbeResult[],
  savedId?: string | null
): RuntimeProbeResult | undefined {
  const enabled = probes.filter((item) => item.enabled);
  const pool = enabled.length ? enabled : probes;
  const preferredId = resolveDefaultRuntimeId(savedId);
  const saved = pool.find((item) => item.id === preferredId);
  if (saved?.available) return saved;
  return pool.find((item) => item.available) || saved || pool[0];
}
