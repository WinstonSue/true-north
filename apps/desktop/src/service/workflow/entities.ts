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
] as const;

export type WorkflowPlanStatus = (typeof WORKFLOW_PLAN_STATUSES)[number];

@Entity('workflow_plan')
export class WorkflowPlan extends BaseEntity {
  @Column('varchar', { length: 32, default: 'drafting' })
  status!: WorkflowPlanStatus;

  @Column('varchar', { nullable: true })
  correlationId?: string;

  @Column('simple-json', { nullable: true })
  meta?: Record<string, unknown>;
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

export const workflowEntities = [
  WorkflowPlan,
  WorkflowNode,
  WorkflowEdge,
  WorkflowCommandAttempt,
  WorkflowDomainEvent,
  WorkflowEventResource,
  WorkflowConflictTicket,
];
