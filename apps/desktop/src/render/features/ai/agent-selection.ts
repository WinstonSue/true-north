import type { RuntimeAgentVo } from '@true-north/vo';

export const FACTORY_DEFAULT_RUNTIME_ID = 'cursor-agent';

export function resolveAgentId(agents: RuntimeAgentVo[], savedId: string | null | undefined): string {
  const preferredId = savedId?.trim() || FACTORY_DEFAULT_RUNTIME_ID;
  const saved = agents.find((item) => item.id === preferredId);
  if (saved?.available) return saved.id;
  const firstAvailable = agents.find((item) => item.available);
  if (firstAvailable) return firstAvailable.id;
  return saved?.id || preferredId || agents[0]?.id || '';
}
