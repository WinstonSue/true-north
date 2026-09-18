import { z } from 'zod';

/** JSON Schema 对象。宿主只校验形状存在，不在清单层解释业务字段。 */
export const jsonSchemaObjectSchema = z.record(z.string(), z.unknown());

export type JsonSchemaObject = Record<string, unknown>;

/** 跨插件资源身份。revision 是目标插件内的单调整数十进制字符串。 */
export type ResourceRef = {
  uri: string;
  revision: string;
};

export const resourceRefSchema = z.object({
  uri: z.string().min(1),
  revision: z.string().min(1),
});

export type WorkflowCommandContribution = {
  /** 只读命令可并行；缺省视为写。 */
  readOnly?: boolean;
  /** 写命令默认 true。相同幂等键必须回放首次结果。 */
  idempotent?: boolean;
  inputSchema: JsonSchemaObject;
  outputSchema?: JsonSchemaObject;
  /** 同插件补偿命令 local id。缺省表示不自动补偿。 */
  compensate?: string;
};

export const workflowCommandContributionSchema = z.object({
  readOnly: z.boolean().optional(),
  idempotent: z.boolean().optional(),
  inputSchema: jsonSchemaObjectSchema,
  outputSchema: jsonSchemaObjectSchema.optional(),
  compensate: z.string().min(1).optional(),
});

export type WorkflowEventContribution = {
  payloadSchema: JsonSchemaObject;
};

export const workflowEventContributionSchema = z.object({
  payloadSchema: jsonSchemaObjectSchema,
});

export type WorkflowInteractionContribution = {
  /** 产出写入哪条同插件 command 的 input 草稿。 */
  producesCommand: string;
  inputSchema?: JsonSchemaObject;
};

export const workflowInteractionContributionSchema = z.object({
  producesCommand: z.string().min(1),
  inputSchema: jsonSchemaObjectSchema.optional(),
});

export const WORKFLOW_NODE_KINDS = ['event', 'command', 'interaction', 'workspace'] as const;
export type WorkflowNodeKind = (typeof WORKFLOW_NODE_KINDS)[number];

export const WORKFLOW_ROLLBACK_POLICIES = ['confirmThenCompensate'] as const;
export type WorkflowRollbackPolicy = (typeof WORKFLOW_ROLLBACK_POLICIES)[number];

export type WorkflowDefinitionNode = {
  key: string;
  kind: WorkflowNodeKind;
  contributionId: string;
  config?: Record<string, unknown>;
};

export const workflowDefinitionNodeSchema = z.object({
  key: z.string().min(1),
  kind: z.enum(WORKFLOW_NODE_KINDS),
  contributionId: z.string().min(1),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type WorkflowDefinitionEdge = {
  key: string;
  from: string;
  to: string;
  condition?: unknown;
};

export const workflowDefinitionEdgeSchema = z.object({
  key: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  condition: z.unknown().optional(),
});

export type WorkflowStart = {
  eventContributionId: string;
  filter?: Record<string, unknown>;
};

export const workflowStartSchema = z.object({
  eventContributionId: z.string(),
  filter: z.record(z.string(), z.unknown()).optional(),
});

export type WorkflowBinding = {
  from: string;
  to: string;
};

export const workflowBindingSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

export type WorkflowLayout = {
  positions?: Record<string, { x: number; y: number }>;
};

export const workflowLayoutSchema = z.object({
  positions: z.record(z.string(), z.object({ x: z.number(), y: z.number() })).optional(),
});

/** 画布与向导共享的规范图。`start` 是虚拟起点，边的 `from` 可为 `start`。 */
export type WorkflowDefinitionGraph = {
  schemaVersion: 1;
  start: WorkflowStart;
  nodes: WorkflowDefinitionNode[];
  edges: WorkflowDefinitionEdge[];
  bindings: WorkflowBinding[];
  rollbackPolicy: WorkflowRollbackPolicy;
  layout?: WorkflowLayout;
};

export const workflowDefinitionGraphSchema = z.object({
  schemaVersion: z.literal(1),
  start: workflowStartSchema,
  nodes: z.array(workflowDefinitionNodeSchema),
  edges: z.array(workflowDefinitionEdgeSchema),
  bindings: z.array(workflowBindingSchema).default([]),
  rollbackPolicy: z.enum(WORKFLOW_ROLLBACK_POLICIES),
  layout: workflowLayoutSchema.optional(),
});

export type WorkflowTemplateContribution = {
  nameKey: string;
  descriptionKey?: string;
  graph: WorkflowDefinitionGraph;
};

export const workflowTemplateContributionSchema = z.object({
  nameKey: z.string().min(1),
  descriptionKey: z.string().min(1).optional(),
  graph: workflowDefinitionGraphSchema,
});

export type WorkflowDefinitionIssue = {
  code:
    | 'empty-graph'
    | 'duplicate-node'
    | 'duplicate-edge'
    | 'unknown-endpoint'
    | 'cycle'
    | 'self-loop'
    | 'unknown-start-event'
    | 'unknown-contribution'
    | 'kind-mismatch'
    | 'missing-compensate'
    | 'invalid-binding';
  message: string;
  nodeKey?: string;
  edgeKey?: string;
};

const START_NODE_KEY = 'start';

export function emptyWorkflowGraph(): WorkflowDefinitionGraph {
  return {
    schemaVersion: 1,
    start: { eventContributionId: '' },
    nodes: [],
    edges: [],
    bindings: [],
    rollbackPolicy: 'confirmThenCompensate',
  };
}

function hasCycle(nodes: string[], edges: Array<{ from: string; to: string }>): string[] | null {
  const outgoing = new Map<string, string[]>();
  for (const key of nodes) outgoing.set(key, []);
  for (const edge of edges) {
    outgoing.get(edge.from)?.push(edge.to);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function visit(key: string): string[] | null {
    if (visited.has(key)) return null;
    if (visiting.has(key)) {
      const start = stack.indexOf(key);
      return stack.slice(start >= 0 ? start : 0).concat(key);
    }
    visiting.add(key);
    stack.push(key);
    for (const next of outgoing.get(key) || []) {
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(key);
    visited.add(key);
    return null;
  }

  for (const key of nodes) {
    const cycle = visit(key);
    if (cycle) return cycle;
  }
  return null;
}

/** 草稿保存用：节点/边唯一、端点存在、DAG。空图允许保存。不查插件目录。 */
export function validateDefinitionGraph(graph: WorkflowDefinitionGraph): WorkflowDefinitionIssue[] {
  const issues: WorkflowDefinitionIssue[] = [];

  const nodeKeys = new Set<string>();
  for (const node of graph.nodes) {
    if (node.key === START_NODE_KEY) {
      issues.push({ code: 'duplicate-node', message: `"start" is reserved`, nodeKey: node.key });
      continue;
    }
    if (nodeKeys.has(node.key)) {
      issues.push({ code: 'duplicate-node', message: `Duplicate node key "${node.key}"`, nodeKey: node.key });
      continue;
    }
    nodeKeys.add(node.key);
  }

  const known = new Set(nodeKeys);
  known.add(START_NODE_KEY);
  const edgeKeys = new Set<string>();
  for (const edge of graph.edges) {
    if (edgeKeys.has(edge.key)) {
      issues.push({ code: 'duplicate-edge', message: `Duplicate edge key "${edge.key}"`, edgeKey: edge.key });
    }
    edgeKeys.add(edge.key);
    if (edge.from === edge.to) {
      issues.push({ code: 'self-loop', message: `Edge "${edge.key}" is a self-loop`, edgeKey: edge.key });
    }
    if (!known.has(edge.from)) {
      issues.push({
        code: 'unknown-endpoint',
        message: `Edge "${edge.key}" from unknown node "${edge.from}"`,
        edgeKey: edge.key,
      });
    }
    if (!known.has(edge.to) || edge.to === START_NODE_KEY) {
      issues.push({
        code: 'unknown-endpoint',
        message: `Edge "${edge.key}" to unknown node "${edge.to}"`,
        edgeKey: edge.key,
      });
    }
  }

  const cycle = hasCycle([START_NODE_KEY, ...nodeKeys], graph.edges);
  if (cycle) {
    issues.push({ code: 'cycle', message: `Workflow graph cycle: ${cycle.join(' -> ')}` });
  }

  for (const binding of graph.bindings) {
    if (!binding.from.includes('.') || !binding.to.includes('.')) {
      issues.push({
        code: 'invalid-binding',
        message: `Binding "${binding.from}" -> "${binding.to}" must use dotted paths`,
      });
    }
  }

  return issues;
}

export type WorkflowPrimitiveCatalog = {
  events: Set<string>;
  commands: Map<string, { compensate?: string }>;
  interactions: Set<string>;
  workspaces: Set<string>;
};

/** 发布用：在 DAG 之上校验原语存在、节点 kind 匹配、可补偿。 */
export function validatePublishedGraph(
  graph: WorkflowDefinitionGraph,
  catalog: WorkflowPrimitiveCatalog,
): WorkflowDefinitionIssue[] {
  const issues = validateDefinitionGraph(graph);
  if (!graph.nodes.length && !graph.start.eventContributionId) {
    issues.push({ code: 'empty-graph', message: 'Workflow graph has no start event or nodes' });
  }
  if (!graph.start.eventContributionId) {
    issues.push({ code: 'unknown-start-event', message: 'Start event is required to publish' });
  } else if (!catalog.events.has(graph.start.eventContributionId)) {
    issues.push({
      code: 'unknown-start-event',
      message: `Unknown start event "${graph.start.eventContributionId}"`,
    });
  }

  for (const node of graph.nodes) {
    if (node.kind === 'event') {
      if (!catalog.events.has(node.contributionId)) {
        issues.push({
          code: 'unknown-contribution',
          message: `Unknown event "${node.contributionId}"`,
          nodeKey: node.key,
        });
      }
    } else if (node.kind === 'command') {
      const command = catalog.commands.get(node.contributionId);
      if (!command) {
        issues.push({
          code: 'unknown-contribution',
          message: `Unknown command "${node.contributionId}"`,
          nodeKey: node.key,
        });
      } else if (graph.rollbackPolicy === 'confirmThenCompensate' && !command.compensate) {
        issues.push({
          code: 'missing-compensate',
          message: `Command "${node.contributionId}" has no compensate command`,
          nodeKey: node.key,
        });
      }
    } else if (node.kind === 'interaction') {
      if (!catalog.interactions.has(node.contributionId)) {
        issues.push({
          code: 'unknown-contribution',
          message: `Unknown interaction "${node.contributionId}"`,
          nodeKey: node.key,
        });
      }
    } else if (node.kind === 'workspace') {
      if (!catalog.workspaces.has(node.contributionId)) {
        issues.push({
          code: 'unknown-contribution',
          message: `Unknown workspace "${node.contributionId}"`,
          nodeKey: node.key,
        });
      }
    }
  }

  return issues;
}

export function topologicalNodeKeys(graph: WorkflowDefinitionGraph): string[] {
  const keys = graph.nodes.map((node) => node.key);
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, string[]>();
  for (const key of keys) {
    incoming.set(key, 0);
    outgoing.set(key, []);
  }
  for (const edge of graph.edges) {
    if (edge.from === START_NODE_KEY) continue;
    if (!incoming.has(edge.to) || !outgoing.has(edge.from)) continue;
    incoming.set(edge.to, (incoming.get(edge.to) || 0) + 1);
    outgoing.get(edge.from)?.push(edge.to);
  }
  const queue = keys.filter((key) => (incoming.get(key) || 0) === 0);
  const ordered: string[] = [];
  while (queue.length) {
    const key = queue.shift()!;
    ordered.push(key);
    for (const next of outgoing.get(key) || []) {
      const count = (incoming.get(next) || 0) - 1;
      incoming.set(next, count);
      if (count === 0) queue.push(next);
    }
  }
  return ordered;
}

export type WorkflowContributions = {
  events?: Record<string, WorkflowEventContribution>;
  commands?: Record<string, WorkflowCommandContribution>;
  interactions?: Record<string, WorkflowInteractionContribution>;
  /** 插件密封模板。用户可复制为 Definition，不能在宿主里改模板本身。 */
  templates?: Record<string, WorkflowTemplateContribution>;
};

export const workflowContributionsSchema = z.object({
  events: z.record(z.string().min(1), workflowEventContributionSchema).optional(),
  commands: z.record(z.string().min(1), workflowCommandContributionSchema).optional(),
  interactions: z.record(z.string().min(1), workflowInteractionContributionSchema).optional(),
  templates: z.record(z.string().min(1), workflowTemplateContributionSchema).optional(),
});

export type EmittedEvent = {
  localId: string;
  payload?: Record<string, unknown>;
  source?: ResourceRef;
  revisionAfter?: string;
};

export type CommandResult =
  | {
      status: 'applied';
      resource?: ResourceRef;
      output?: unknown;
      events?: EmittedEvent[];
    }
  | {
      status: 'noop';
      resource?: ResourceRef;
      reason: 'alreadyApplied' | 'idempotentReplay';
      output?: unknown;
    }
  | {
      status: 'conflict';
      resource?: ResourceRef;
      current?: unknown;
      expectedRevision?: string;
      actualRevision?: string;
      reason: string;
    }
  | {
      status: 'rejected';
      reason: string;
      code: 'precondition' | 'validation' | 'idempotencyCollision' | 'policy';
    }
  | {
      status: 'notFound';
      uri?: string;
    }
  | {
      status: 'unavailable';
      reason: 'pluginMissing' | 'handlerMissing' | 'pluginDisabled';
    };

export const commandResultSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('applied'),
    resource: resourceRefSchema.optional(),
    output: z.unknown().optional(),
    events: z
      .array(
        z.object({
          localId: z.string().min(1),
          payload: z.record(z.string(), z.unknown()).optional(),
          source: resourceRefSchema.optional(),
          revisionAfter: z.string().min(1).optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    status: z.literal('noop'),
    resource: resourceRefSchema.optional(),
    reason: z.enum(['alreadyApplied', 'idempotentReplay']),
    output: z.unknown().optional(),
  }),
  z.object({
    status: z.literal('conflict'),
    resource: resourceRefSchema.optional(),
    current: z.unknown().optional(),
    expectedRevision: z.string().min(1).optional(),
    actualRevision: z.string().min(1).optional(),
    reason: z.string().min(1),
  }),
  z.object({
    status: z.literal('rejected'),
    reason: z.string().min(1),
    code: z.enum(['precondition', 'validation', 'idempotencyCollision', 'policy']),
  }),
  z.object({
    status: z.literal('notFound'),
    uri: z.string().min(1).optional(),
  }),
  z.object({
    status: z.literal('unavailable'),
    reason: z.enum(['pluginMissing', 'handlerMissing', 'pluginDisabled']),
  }),
]);

export type WorkflowCommandContext = {
  pluginId: string;
  planId?: string;
  nodeId?: string;
  edgeId?: string;
  attemptId: string;
  idempotencyKey: string;
};

export type DomainEvent = {
  id: string;
  type: string;
  sourceUri?: string;
  occurredAt: string;
  causationId?: string;
  correlationId?: string;
  payload: Record<string, unknown>;
  revisionAfter?: string;
  schemaVersion: 1;
};

export const CONFLICT_ACTIONS = [
  'retryWithRevision',
  'skipEdge',
  'cancelPlan',
  'acceptCurrent',
  'openInteraction',
] as const;

export type ConflictAction = (typeof CONFLICT_ACTIONS)[number];
