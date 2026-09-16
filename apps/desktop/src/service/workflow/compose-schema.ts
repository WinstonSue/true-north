import { z } from 'zod';

export const composeSchema = z.object({
  nodes: z
    .array(
      z.object({
        workspaceId: z.string().min(1),
        pluginId: z.string().min(1),
        commandId: z.string().min(1),
        input: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .min(1),
  edges: z
    .array(
      z.object({
        fromWorkspaceId: z.string().min(1),
        toWorkspaceId: z.string().min(1),
        commands: z.array(z.string().min(1)).min(1),
        interactionId: z.string().min(1).optional(),
      }),
    )
    .optional(),
});

export type ComposeInput = z.infer<typeof composeSchema>;
