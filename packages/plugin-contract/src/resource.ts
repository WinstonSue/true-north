import { z } from 'zod';

export const pluginResourceRefSchema = z.object({
  uri: z.string().min(1),
  label: z.string().optional(),
});

export type PluginResourceRef = z.infer<typeof pluginResourceRefSchema>;
