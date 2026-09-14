import type { RuntimeAgentDef, RuntimeAgentId, RuntimeSpawnInput, RuntimeSpawnResult } from '../types';

export type RuntimeAdapter = {
  id: RuntimeAgentId;
  name: string;
  binaries: string[];
  extraSearchDirs?: () => string[];
  def: RuntimeAgentDef;
  probeAuth: (binPath: string) => Promise<boolean>;
  probeVersion?: (binPath: string) => Promise<string | undefined>;
  unavailableInstallReason: () => string;
  prepareWorkspace: (input: { workspaceDir: string; mcpUrl: string }) => Promise<{ cwd: string }>;
  spawn: (input: RuntimeSpawnInput) => Promise<RuntimeSpawnResult>;
};
