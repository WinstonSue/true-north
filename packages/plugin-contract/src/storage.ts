import { z } from 'zod';

export const hostStorageCapabilitySchema = z.literal('self-managed');

export type HostStorageCapability = z.infer<typeof hostStorageCapabilitySchema>;

export type PluginSpace = {
  pluginId: string;
  rootDir: string;
  legacySharedDbPath?: string;
};
