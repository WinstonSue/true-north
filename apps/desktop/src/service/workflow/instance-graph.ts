import { topologicalNodeKeys, type WorkflowDefinitionGraph } from '@true-north/plugin-contract';
import type { WorkflowPlan } from './entities';

export function graphOf(plan: WorkflowPlan): WorkflowDefinitionGraph {
  return (plan.meta?.graph || {
    schemaVersion: 1,
    start: { eventContributionId: '' },
    nodes: [],
    edges: [],
    bindings: [],
    rollbackPolicy: 'confirmThenCompensate',
  }) as WorkflowDefinitionGraph;
}

export function reverseCommandKeys(graph: WorkflowDefinitionGraph) {
  return topologicalNodeKeys(graph)
    .map((key) => graph.nodes.find((node) => node.key === key))
    .filter((node) => node?.kind === 'command')
    .reverse()
    .map((node) => node!.key);
}
