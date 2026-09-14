import type { ConversationVo } from './conversation.vo';

export type RuntimeAgentVo = {
  id: string;
  name: string;
  available: boolean;
  authenticated: boolean;
  unavailableReason?: string;
};

export type RuntimeAgentManagementVo = {
  id: string;
  name: string;
  enabled: boolean;
  available: boolean;
  authenticated: boolean;
  version?: string;
  resolvedPath?: string;
  autoDetectedPath?: string;
  pathOverride?: string | null;
  unavailableReason?: string;
  isDefault: boolean;
};

export type RuntimeSettingsVo = {
  defaultRuntimeId: string | null;
  agents: RuntimeAgentManagementVo[];
};

export type PutRuntimeAgentSettingsVo = {
  id: string;
  enabled?: boolean;
  pathOverride?: string | null;
};

export type PutRuntimeSettingsRequestVo = {
  defaultRuntimeId?: string | null;
  agents?: PutRuntimeAgentSettingsVo[];
};

export type RuntimeSelectionVo = {
  runtimeId: string | null;
};

export type PutRuntimeSelectionRequestVo = {
  runtimeId: string;
};

export type PatchConversationRuntimeRequestVo = {
  runtimeId: string;
};

export type EnsureBoundConversationRequestVo = {
  refType: string;
  refId: string;
};

export type EnsureBoundGoalRequestVo = {
  goalId: string;
};

export type EnsureBoundTaskRequestVo = {
  taskId: string;
};

export type EnsureBoundConversationResponseVo = {
  conversation: ConversationVo;
  created: boolean;
};

export type ExecuteCapabilityRequestVo = {
  key: string;
  input: Record<string, unknown>;
};
