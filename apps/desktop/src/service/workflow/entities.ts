import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

export const WORKFLOW_EDGE_STATUSES = [
  'armed',
  'awaiting_interaction',
  'dispatching',
  'succeeded',
  'conflict',
  'retryable_error',
  'blocked_plugin',
  'failed_terminal',
  'cancelled',
  'expired',
] as const;

export type WorkflowEdgeStatus = (typeof WORKFLOW_EDGE_STATUSES)[number];

export const WORKFLOW_PLAN_STATUSES = [
  'drafting',
  'armed',
  'running',
  'awaiting_interaction',
  'conflict',
  'completed',
  'partial',
  'cancelled',
  'rolling_back',
  'rolled_back',
] as const;

export type WorkflowPlanStatus = (typeof WORKFLOW_PLAN_STATUSES)[number];

@Entity('workflow_plan')
@Index('workflow_plan_association_event', ['associationId', 'triggerEventId'], { unique: true })
export class WorkflowPlan extends BaseEntity {
  @Column('varchar', { length: 32, default: 'drafting' })
  status!: WorkflowPlanStatus;

  @Column('varchar', { nullable: true })
  correlationId?: string;

  @Column('simple-json', { nullable: true })
  meta?: Record<string, unknown>;

  @Column('varchar', { nullable: true })
  definitionId?: string;

  @Column('int', { nullable: true })
  definitionVersion?: number;

  @Column('varchar', { nullable: true })
  associationId?: string;

  @Column('varchar', { nullable: true })
  triggerEventId?: string;

  @Column('datetime', { nullable: true })
  startedAt?: Date;

  @Column('datetime', { nullable: true })
  completedAt?: Date;

  @Column('datetime', { nullable: true })
  rollbackStartedAt?: Date;

  @Column('datetime', { nullable: true })
  rollbackCompletedAt?: Date;

  @Column('datetime', { nullable: true })
  sourceDetachedAt?: Date;
}

@Entity('workflow_node')
export class WorkflowNode extends BaseEntity {
  @Column('varchar')
  planId!: string;

  @Column('varchar')
  pluginId!: string;

  @Column('varchar', { nullable: true })
  workspaceId?: string;

  @Column('varchar', { nullable: true })
  commandId?: string;

  @Column('varchar', { length: 32, default: 'proposal' })
  kind!: 'proposal' | 'command';

  @Column('simple-json', { nullable: true })
  input?: Record<string, unknown>;

  @Column('varchar', { nullable: true })
  outputUri?: string;

  @Column('varchar', { nullable: true })
  outputRevision?: string;

  @Column('varchar', { length: 32, default: 'pending' })
  status!: 'pending' | 'adopted' | 'failed' | 'skipped';
}

@Entity('workflow_edge')
export class WorkflowEdge extends BaseEntity {
  @Column('varchar')
  planId!: string;

  @Column('varchar')
  fromNodeId!: string;

  @Column('varchar')
  toNodeId!: string;

  @Column('varchar', { nullable: true })
  commandId?: string;

  @Column('simple-json', { nullable: true })
  commandQueue?: string[];

  @Column('int', { default: 0 })
  commandCursor!: number;

  @Column('varchar', { nullable: true })
  interactionId?: string;

  @Column('varchar', { length: 32, default: 'armed' })
  status!: WorkflowEdgeStatus;

  @Column('varchar', { nullable: true })
  lastAttemptId?: string;

  @Column('simple-json', { nullable: true })
  lastResult?: Record<string, unknown>;

  @Column('simple-json', { nullable: true })
  interactionInput?: Record<string, unknown>;
}

@Entity('workflow_command_attempt')
@Index('workflow_command_attempt_idempotency_key', ['idempotencyKey'], { unique: true })
export class WorkflowCommandAttempt extends BaseEntity {
  @Column('varchar', { nullable: true })
  planId?: string;

  @Column('varchar', { nullable: true })
  nodeId?: string;

  @Column('varchar', { nullable: true })
  workspaceId?: string;

  @Column('varchar', { nullable: true })
  edgeId?: string;

  @Column('varchar')
  pluginId!: string;

  @Column('varchar')
  commandId!: string;

  @Column('varchar')
  idempotencyKey!: string;

  @Column('varchar')
  inputHash!: string;

  @Column('simple-json', { nullable: true })
  input?: unknown;

  @Column('varchar', { length: 32, default: 'pending' })
  status!: 'pending' | 'running' | 'completed';

  @Column('simple-json', { nullable: true })
  result?: Record<string, unknown>;
}

@Entity('workflow_domain_event')
export class WorkflowDomainEvent extends BaseEntity {
  @Column('varchar')
  type!: string;

  @Column('varchar', { nullable: true })
  sourceUri?: string;

  @Column('datetime')
  occurredAt!: Date;

  @Column('varchar', { nullable: true })
  causationId?: string;

  @Column('varchar', { nullable: true })
  correlationId?: string;

  @Column('simple-json')
  payload!: Record<string, unknown>;

  @Column('varchar', { nullable: true })
  revisionAfter?: string;

  @Column('int', { default: 1 })
  schemaVersion!: number;

  @Column('simple-json', { nullable: true })
  display?: Record<string, unknown>;
}

@Entity('workflow_event_resource')
export class WorkflowEventResource {
  @PrimaryColumn('varchar')
  eventId!: string;

  @PrimaryColumn('varchar')
  uri!: string;

  @Column('varchar', { nullable: true })
  role?: string;
}

@Entity('workflow_conflict_ticket')
export class WorkflowConflictTicket extends BaseEntity {
  @Column('int', { default: 1 })
  ticketRevision!: number;

  @Column('varchar', { nullable: true })
  planId?: string;

  @Column('varchar', { nullable: true })
  edgeId?: string;

  @Column('varchar', { nullable: true })
  attemptId?: string;

  @Column('varchar', { nullable: true })
  commandId?: string;

  @Column('varchar', { nullable: true })
  targetUri?: string;

  @Column('varchar', { nullable: true })
  expectedRevision?: string;

  @Column('varchar', { nullable: true })
  actualRevision?: string;

  @Column('varchar')
  resultStatus!: string;

  @Column('varchar', { nullable: true })
  reasonCode?: string;

  @Column('text', { nullable: true })
  reason?: string;

  @Column('simple-json', { nullable: true })
  succeededPredecessors?: string[];

  @Column('simple-json', { nullable: true })
  relatedUris?: string[];

  @Column('simple-json', { nullable: true })
  allowedActions?: string[];

  @Column('simple-json', { nullable: true })
  diagnostic?: Record<string, unknown>;

  @Column('varchar', { length: 32, default: 'open' })
  status!: 'open' | 'resolved' | 'stale';
}

@Entity('workflow_definition')
@Index('workflow_definition_source_template_key', ['sourceTemplateKey'], { unique: true })
export class WorkflowDefinition extends BaseEntity {
  @Column('varchar')
  title!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('varchar', { nullable: true })
  sourceTemplateKey?: string;

  @Column('simple-json')
  graph!: Record<string, unknown>;

  @Column('varchar', { length: 16, default: 'draft' })
  status!: 'draft' | 'published';

  @Column('int', { nullable: true })
  currentVersion?: number;
}

@Entity('workflow_definition_version')
@Index('workflow_definition_version_unique', ['definitionId', 'version'], { unique: true })
export class WorkflowDefinitionVersion extends BaseEntity {
  @Column('varchar')
  definitionId!: string;

  @Column('int')
  version!: number;

  @Column('simple-json')
  graph!: Record<string, unknown>;

  @Column('simple-json', { nullable: true })
  primitivePins?: Record<string, unknown>;

  @Column('datetime')
  publishedAt!: Date;
}

@Entity('workflow_association')
@Index('workflow_association_owner', ['ownerPluginId', 'ownerKind', 'ownerId'], { unique: true })
export class WorkflowAssociation extends BaseEntity {
  @Column('varchar')
  ownerPluginId!: string;

  @Column('varchar')
  ownerKind!: string;

  @Column('varchar')
  ownerId!: string;

  @Column('varchar')
  definitionId!: string;

  @Column('varchar', { length: 24, default: 'latest_published' })
  versionPolicy!: 'latest_published' | 'pinned';

  @Column('int', { nullable: true })
  pinnedVersion?: number;

  @Column('boolean', { default: true })
  enabled!: boolean;
}

@Entity('workflow_event_outbox')
@Index('workflow_event_outbox_event', ['eventId'], { unique: true })
export class WorkflowEventOutbox extends BaseEntity {
  @Column('varchar')
  eventId!: string;

  @Column('varchar')
  type!: string;

  @Column('simple-json')
  payload!: Record<string, unknown>;

  @Column('varchar', { nullable: true })
  sourceUri?: string;

  @Column('varchar', { length: 16, default: 'pending' })
  status!: 'pending' | 'processed' | 'failed';

  @Column('int', { default: 0 })
  attempts!: number;

  @Column('text', { nullable: true })
  lastError?: string;

  @Column('datetime', { nullable: true })
  processedAt?: Date;
}

@Entity('workflow_workspace')
@Index('workflow_workspace_adopt', ['adoptKey'], { unique: true })
export class WorkflowWorkspace extends BaseEntity {
  @Column('varchar')
  planId!: string;

  @Column('varchar')
  nodeKey!: string;

  @Column('varchar')
  contributionId!: string;

  @Column('simple-json')
  state!: Record<string, unknown>;

  @Column('varchar', { length: 16, default: 'pending' })
  status!: 'pending' | 'open' | 'adopted' | 'dismissed' | 'expired';

  @Column('varchar')
  adoptKey!: string;

  @Column('datetime', { nullable: true })
  adoptedAt?: Date;
}

@Entity('workflow_node_state')
@Index('workflow_node_state_unique', ['planId', 'nodeKey'], { unique: true })
export class WorkflowNodeState extends BaseEntity {
  @Column('varchar')
  planId!: string;

  @Column('varchar')
  nodeKey!: string;

  @Column('varchar', { length: 24, default: 'pending' })
  status!: 'pending' | 'waiting' | 'applied' | 'skipped' | 'compensating' | 'compensated' | 'conflict' | 'failed';

  @Column('simple-json', { nullable: true })
  input?: Record<string, unknown>;

  @Column('simple-json', { nullable: true })
  output?: unknown;

  @Column('simple-json', { nullable: true })
  resource?: { uri: string; revision: string };

  @Column('simple-json', { nullable: true })
  lastResult?: Record<string, unknown>;
}

export const workflowEntities = [
  WorkflowPlan,
  WorkflowNode,
  WorkflowEdge,
  WorkflowCommandAttempt,
  WorkflowDomainEvent,
  WorkflowEventResource,
  WorkflowConflictTicket,
  WorkflowDefinition,
  WorkflowDefinitionVersion,
  WorkflowAssociation,
  WorkflowEventOutbox,
  WorkflowWorkspace,
  WorkflowNodeState,
];
