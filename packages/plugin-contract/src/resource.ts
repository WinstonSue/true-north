import { z } from 'zod';

export const pluginResourceRefSchema = z.object({
  /** 不透明资源 URI，通常为 `tn://{pluginId}/{collection}/{id}`。 */
  uri: z.string().min(1),
  label: z.string().optional(),
});

export type PluginResourceRef = z.infer<typeof pluginResourceRefSchema>;
