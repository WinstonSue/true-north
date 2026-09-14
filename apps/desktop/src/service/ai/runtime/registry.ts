import type { RuntimeAgentDef, RuntimeAgentId } from './types.ts';
import { RUNTIME_AGENT_IDS } from './types.ts';

export { RUNTIME_AGENT_IDS, isRuntimeAgentId } from './types.ts';
export type { RuntimeAgentId };

export const RUNTIME_AGENT_DEFS: RuntimeAgentDef[] = [
  {
    id: 'codex',
    name: 'ChatGPT',
    binaries: ['codex'],
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    binaries: ['claude'],
  },
  {
    id: 'cursor-agent',
    name: 'Cursor Agent',
    binaries: ['agent', 'cursor-agent'],
  },
];

export function agentDef(id: string): RuntimeAgentDef | undefined {
  return RUNTIME_AGENT_DEFS.find((item) => item.id === id);
}
