import {
  workflowDefinitionGraphSchema,
  type WorkflowDefinitionGraph,
} from '@true-north/plugin-contract';
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

export { workflowDefinitionGraphSchema };
export type { WorkflowDefinitionGraph };

/** AI 作曲器的扁平节点投影自规范图的 command/workspace 节点。 */
export function composeInputFromGraph(graph: WorkflowDefinitionGraph): ComposeInput {
  const nodes = graph.nodes
    .filter((node) => node.kind === 'command' || node.kind === 'workspace')
    .map((node) => {
      const [pluginId, ...rest] = node.contributionId.split('.');
      return {
        workspaceId: node.key,
        pluginId: pluginId || 'host',
        commandId: node.contributionId,
        input: (node.config as Record<string, unknown> | undefined) || undefined,
      };
    });
  const edges = graph.edges
    .filter((edge) => edge.from !== 'start')
    .map((edge) => ({
      fromWorkspaceId: edge.from,
      toWorkspaceId: edge.to,
      commands: [graph.nodes.find((node) => node.key === edge.to)?.contributionId || edge.to],
    }));
  return { nodes, edges };
}

export function graphFromCompose(input: ComposeInput, startEvent = ''): WorkflowDefinitionGraph {
  return {
    schemaVersion: 1,
    start: { eventContributionId: startEvent },
    nodes: input.nodes.map((node) => ({
      key: node.workspaceId,
      kind: 'command' as const,
      contributionId: node.commandId.includes('.') ? node.commandId : `${node.pluginId}.${node.commandId}`,
      config: node.input,
    })),
    edges: (input.edges || []).map((edge, index) => ({
      key: `e${index + 1}`,
      from: edge.fromWorkspaceId,
      to: edge.toWorkspaceId,
    })),
    bindings: [],
    rollbackPolicy: 'confirmThenCompensate',
  };
}
