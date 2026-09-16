import type { RuntimeAgentVo } from '@true-north/vo';
import type { AiMessagePartVo, MessageVo } from '@true-north/vo';

export const RUNTIME_AGENT_IDS = ['codex', 'claude-code', 'cursor-agent'] as const;
export type RuntimeAgentId = (typeof RUNTIME_AGENT_IDS)[number];

export function isRuntimeAgentId(id: string): id is RuntimeAgentId {
  return (RUNTIME_AGENT_IDS as readonly string[]).includes(id);
}

export type RuntimeAgentDef = {
  id: RuntimeAgentId;
  name: string;
  binaries: string[];
};

export type RuntimeProbeResult = RuntimeAgentVo & {
  enabled: boolean;
  resolvedPath?: string;
  autoDetectedPath?: string;
  pathOverride?: string | null;
  version?: string;
};

export type StreamSessionContext = {
  streamId: string;
  conversationId: string;
  assistantId: string;
  parts: AiMessagePartVo[];
  persistParts: (parts: AiMessagePartVo[]) => Promise<MessageVo>;
  conflictMode?: boolean;
  conflictTicketId?: string;
};

export type RuntimeSpawnInput = {
  streamId: string;
  def: RuntimeAgentDef;
  binPath: string;
  workspaceDir: string;
  mcpUrl: string;
  prompt: string;
  resumeThreadId?: string;
  signal: AbortSignal;
  onDelta: (text: string) => void;
  onThreadId: (threadId: string) => void;
};

export type RuntimeSpawnResult = {
  threadId?: string;
  exitCode: number | null;
  stderr: string;
};
