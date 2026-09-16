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

export type WorkflowContributions = {
  events?: Record<string, WorkflowEventContribution>;
  commands?: Record<string, WorkflowCommandContribution>;
  interactions?: Record<string, WorkflowInteractionContribution>;
};

export const workflowContributionsSchema = z.object({
  events: z.record(z.string().min(1), workflowEventContributionSchema).optional(),
  commands: z.record(z.string().min(1), workflowCommandContributionSchema).optional(),
  interactions: z.record(z.string().min(1), workflowInteractionContributionSchema).optional(),
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
