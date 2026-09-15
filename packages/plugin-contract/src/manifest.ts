import { z } from 'zod';
import { PLUGIN_API_VERSION, SHELL_SLOT_IDS, contributionKey } from './ids.ts';
import { todaySectionDescriptorSchema } from './today.ts';

export const emptyContributionSchema = z.object({}).strict();

export const shellSlotContributionSchema = z.object({
  slot: z.enum(SHELL_SLOT_IDS),
  order: z.number().optional(),
});

export const viewContributionSchema = z.object({
  nameKey: z.string().min(1),
  order: z.number().optional(),
  default: z.boolean().optional(),
});

export const skillContributionSchema = z.object({
  root: z.string().min(1),
});

export const mcpToolContributionSchema = z.object({
  readOnly: z.boolean().optional(),
});

export const mcpResourceContributionSchema = z.object({
  uriTemplate: z.string().min(1),
});

export const pluginContributionsSchema = z.object({
  ipc: z.record(z.string().min(1), emptyContributionSchema).optional(),
  views: z.record(z.string().min(1), viewContributionSchema).optional(),
  workbench: z
    .object({
      workspaces: z.record(z.string().min(1), emptyContributionSchema).optional(),
      actions: z.record(z.string().min(1), emptyContributionSchema).optional(),
    })
    .optional(),
  activity: z
    .object({
      captureTypes: z.record(z.string().min(1), emptyContributionSchema).optional(),
      today: z.record(z.string().min(1), todaySectionDescriptorSchema).optional(),
    })
    .optional(),
  storage: z
    .object({
      capability: z.literal('self-managed'),
    })
    .optional(),
  shell: z
    .object({
      slots: z.record(z.string().min(1), shellSlotContributionSchema).optional(),
    })
    .optional(),
  ai: z
    .object({
      skills: z.record(z.string().min(1), skillContributionSchema).optional(),
      mcp: z
        .object({
          tools: z.record(z.string().min(1), mcpToolContributionSchema).optional(),
          resources: z.record(z.string().min(1), mcpResourceContributionSchema).optional(),
          prompts: z.record(z.string().min(1), emptyContributionSchema).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const pluginCatalogMetaSchema = z.object({
  nameKey: z.string().min(1),
  descriptionKey: z.string().min(1).optional(),
  categoryKey: z.string().min(1).optional(),
  keywords: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export const pluginManifestSchema = z.object({
  pluginId: z.string().min(1).regex(/^[a-z][a-z0-9-]*$/),
  apiVersion: z.literal(PLUGIN_API_VERSION).default(PLUGIN_API_VERSION),
  version: z.string().min(1),
  dependencies: z.array(z.string().min(1)).optional(),
  catalog: pluginCatalogMetaSchema,
  contributions: pluginContributionsSchema.default({}),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;
export type PluginManifestInput = z.input<typeof pluginManifestSchema>;

export function definePluginManifest<const M extends PluginManifestInput>(
  manifest: M,
): M & { apiVersion: typeof PLUGIN_API_VERSION } {
  return pluginManifestSchema.parse(manifest) as M & { apiVersion: typeof PLUGIN_API_VERSION };
}

export function parsePluginManifest(input: unknown): PluginManifest {
  return pluginManifestSchema.parse(input);
}

export function derivedContributionId(manifest: PluginManifest, localId: string): string {
  return contributionKey(manifest.pluginId, localId);
}
