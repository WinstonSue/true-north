import { workflowStore } from './storage';
import { WorkflowEdge, WorkflowNode, WorkflowPlan } from './entities';
import { composeSchema, type ComposeInput } from './compose-schema';

export async function composeWorkflow(raw: unknown) {
  const input = composeSchema.parse(raw);
  const workspaceIds = new Set(input.nodes.map((node) => node.workspaceId));
  for (const edge of input.edges || []) {
    if (!workspaceIds.has(edge.fromWorkspaceId) || !workspaceIds.has(edge.toWorkspaceId)) {
      throw new Error('workflow.compose edge references unknown workspaceId');
    }
  }
  const planRepo = workflowStore().getRepository(WorkflowPlan);
  const plan = await planRepo.save(planRepo.create({ status: 'drafting' }));
  const nodeRepo = workflowStore().getRepository(WorkflowNode);
  const nodes = await Promise.all(
    input.nodes.map((node) =>
      nodeRepo.save(
        nodeRepo.create({
          planId: plan.id,
          pluginId: node.pluginId,
          workspaceId: node.workspaceId,
          commandId: node.commandId,
          kind: 'proposal',
          input: node.input,
          status: 'pending',
        }),
      ),
    ),
  );
  const byWorkspace = new Map(nodes.map((node) => [node.workspaceId, node]));
  const edgeRepo = workflowStore().getRepository(WorkflowEdge);
  const edges = await Promise.all(
    (input.edges || []).map((edge) =>
      edgeRepo.save(
        edgeRepo.create({
          planId: plan.id,
          fromNodeId: byWorkspace.get(edge.fromWorkspaceId)!.id,
          toNodeId: byWorkspace.get(edge.toWorkspaceId)!.id,
          commandQueue: edge.commands,
          commandId: edge.commands[0],
          interactionId: edge.interactionId,
          commandCursor: 0,
          status: 'armed',
        }),
      ),
    ),
  );
  return {
    planId: plan.id,
    nodes: nodes.map((node) => ({ id: node.id, workspaceId: node.workspaceId, commandId: node.commandId })),
    edges: edges.map((edge) => ({ id: edge.id, fromNodeId: edge.fromNodeId, toNodeId: edge.toNodeId })),
  };
}

export { composeSchema, type ComposeInput };
