import { randomUUID } from 'crypto';
import {
  contributionKey,
  parsePluginResourceUri,
  type CommandResult,
  type ConflictAction,
  CONFLICT_ACTIONS,
} from '@true-north/plugin-contract';
import { extensionPoints } from '@true-north/plugin-sdk';
import { decideHostAttemptReplay, hashCommandInput, workspaceAdoptKey } from '@true-north/plugin-sdk/main';
import { getMainExtensionsOptional } from '../../plugin/extensions';
import { workflowStore } from './storage';
import {
  WorkflowCommandAttempt,
  WorkflowConflictTicket,
  WorkflowEdge,
  WorkflowNode,
  WorkflowPlan,
} from './entities';
import { workflowEventService } from './event.service';
import { edgeStatusFor, nextEdgeAfterSuccess, planStatusFor } from './edge-policy';
import { notificationService } from '../notification';
import { conflictResourceUri } from '../../plugin/host-ids';

const RETRYABLE = new Set(['unavailable']);

function redact(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.slice(0, 20).map(redact);
  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (/(secret|token|password|card|cvv|credential)/i.test(key)) continue;
    if (typeof entry === 'string' && entry.length > 400) next[key] = `${entry.slice(0, 400)}…`;
    else next[key] = redact(entry);
  }
  return next;
}

function collisionResult(): CommandResult {
  return {
    status: 'rejected',
    code: 'idempotencyCollision',
    reason: 'same host attempt key with different input',
  };
}

export class WorkflowRunner {
  private inflight = new Map<string, Promise<CommandResult>>();

  async runCommand(input: {
    pluginId: string;
    localId: string;
    commandInput: unknown;
    planId?: string;
    nodeId?: string;
    workspaceId?: string;
    edgeId?: string;
    idempotencyKey?: string;
  }): Promise<CommandResult> {
    const idempotencyKey =
      input.idempotencyKey ||
      (input.workspaceId ? workspaceAdoptKey(input.workspaceId, input.pluginId, input.localId) : randomUUID());
    const pending = this.inflight.get(idempotencyKey);
    if (pending) return pending;
    const run = this.executeAttempt({ ...input, idempotencyKey }).finally(() => {
      this.inflight.delete(idempotencyKey);
    });
    this.inflight.set(idempotencyKey, run);
    return run;
  }

  private async executeAttempt(input: {
    pluginId: string;
    localId: string;
    commandInput: unknown;
    planId?: string;
    nodeId?: string;
    workspaceId?: string;
    edgeId?: string;
    idempotencyKey: string;
  }): Promise<CommandResult> {
    const commandId = contributionKey(input.pluginId, input.localId);
    const inputHash = hashCommandInput(input.commandInput);
    const attemptRepo = workflowStore().getRepository(WorkflowCommandAttempt);
    let existing = await attemptRepo.findOneBy({ idempotencyKey: input.idempotencyKey });
    if (existing) {
      const decision = decideHostAttemptReplay(existing, inputHash);
      if (decision.action === 'replay') return decision.result;
      if (decision.action === 'collision') return collisionResult();
    }

    let attempt = existing;
    if (!attempt) {
      try {
        attempt = await attemptRepo.save(
          attemptRepo.create({
            planId: input.planId,
            nodeId: input.nodeId,
            workspaceId: input.workspaceId,
            edgeId: input.edgeId,
            pluginId: input.pluginId,
            commandId,
            idempotencyKey: input.idempotencyKey,
            inputHash,
            input: input.commandInput,
            status: 'pending',
          }),
        );
      } catch {
        existing = await attemptRepo.findOneBy({ idempotencyKey: input.idempotencyKey });
        if (!existing) throw new Error('failed to persist command attempt');
        const decision = decideHostAttemptReplay(existing, inputHash);
        if (decision.action === 'replay') return decision.result;
        if (decision.action === 'collision') return collisionResult();
        attempt = existing;
      }
    }

    attempt.planId = input.planId || attempt.planId;
    attempt.nodeId = input.nodeId || attempt.nodeId;
    attempt.workspaceId = input.workspaceId || attempt.workspaceId;
    attempt.edgeId = input.edgeId || attempt.edgeId;
    attempt.inputHash = inputHash;
    attempt.input = input.commandInput;
    attempt.status = 'running';
    await attemptRepo.save(attempt);

    const registry = getMainExtensionsOptional();
    const handler = registry?.get(extensionPoints.workflowCommand, commandId);
    if (!handler) {
      const result: CommandResult = {
        status: 'unavailable',
        reason: registry?.list(extensionPoints.plugin).some((plugin) => plugin.pluginId === input.pluginId)
          ? 'handlerMissing'
          : 'pluginMissing',
      };
      return this.finishAttempt(attempt, result);
    }

    let result: CommandResult;
    try {
      result = await handler.execute(input.commandInput, {
        pluginId: input.pluginId,
        planId: input.planId,
        nodeId: input.nodeId,
        edgeId: input.edgeId,
        attemptId: attempt.id,
        idempotencyKey: input.idempotencyKey,
      });
    } catch {
      result = { status: 'unavailable', reason: 'pluginDisabled' };
    }
    return this.finishAttempt(attempt, result);
  }

  private async finishAttempt(attempt: WorkflowCommandAttempt, result: CommandResult): Promise<CommandResult> {
    attempt.status = 'completed';
    attempt.result = result as Record<string, unknown>;
    await workflowStore().getRepository(WorkflowCommandAttempt).save(attempt);
    if (result.status === 'applied' && result.events?.length) {
      for (const event of result.events) {
        await workflowEventService.emit({
          pluginId: attempt.pluginId,
          localId: event.localId,
          payload: event.payload,
          source: event.source,
          causationId: attempt.id,
          correlationId: attempt.planId,
        });
      }
    }
    if ((result.status === 'applied' || result.status === 'noop') && result.resource) {
      await this.bindProposalNode(attempt, result);
    }
    if (attempt.workspaceId && (result.status === 'applied' || result.status === 'noop')) {
      const { workflowInstanceService } = await import('./instance.service');
      await workflowInstanceService.onWorkspaceCommand(attempt.workspaceId, result, attempt.input);
    }
    if (attempt.edgeId) {
      await this.advanceEdge(attempt.edgeId, result, attempt);
    }
    return result;
  }

  private async bindProposalNode(attempt: WorkflowCommandAttempt, result: CommandResult) {
    if (result.status !== 'applied' && result.status !== 'noop') return;
    if (!result.resource) return;
    const nodeRepo = workflowStore().getRepository(WorkflowNode);
    const node = attempt.workspaceId
      ? await nodeRepo.findOneBy({ workspaceId: attempt.workspaceId, status: 'pending' })
      : attempt.nodeId
        ? await nodeRepo.findOneBy({ id: attempt.nodeId, status: 'pending' })
        : null;
    if (!node) return;
    node.status = 'adopted';
    node.outputUri = result.resource.uri;
    node.outputRevision = result.resource.revision;
    await nodeRepo.save(node);
    await this.maybeArmEdges(node.planId);
  }

  private async maybeArmEdges(planId: string) {
    const nodeRepo = workflowStore().getRepository(WorkflowNode);
    const edgeRepo = workflowStore().getRepository(WorkflowEdge);
    const nodes = await nodeRepo.findBy({ planId });
    const edges = await edgeRepo.findBy({ planId });
    const byId = new Map(nodes.map((node) => [node.id, node]));
    for (const edge of edges) {
      if (edge.status !== 'armed' || edge.commandCursor !== 0) continue;
      const from = byId.get(edge.fromNodeId);
      const to = byId.get(edge.toNodeId);
      if (from?.status === 'adopted' && to?.status === 'adopted') {
        await this.dispatchNext(edge);
      }
    }
  }

  async listPending() {
    const edgeRepo = workflowStore().getRepository(WorkflowEdge);
    const nodeRepo = workflowStore().getRepository(WorkflowNode);
    const edges = await edgeRepo.findBy({ status: 'awaiting_interaction' });
    return Promise.all(
      edges.map(async (edge) => {
        const fromNode = await nodeRepo.findOneBy({ id: edge.fromNodeId });
        const toNode = await nodeRepo.findOneBy({ id: edge.toNodeId });
        return {
          edgeId: edge.id,
          planId: edge.planId,
          interactionId: edge.interactionId,
          draft: {
            ...(fromNode?.input || {}),
            ...(toNode?.input || {}),
            ...(edge.interactionInput || {}),
            title: toNode?.input?.title || toNode?.input?.name || fromNode?.input?.title,
            uri: toNode?.outputUri,
            expectedRevision: toNode?.outputRevision,
          },
        };
      }),
    );
  }

  async advanceEdge(edgeId: string, result: CommandResult, attempt: WorkflowCommandAttempt) {
    const edgeRepo = workflowStore().getRepository(WorkflowEdge);
    const edge = await edgeRepo.findOneBy({ id: edgeId });
    if (!edge) return;
    edge.lastAttemptId = attempt.id;
    edge.lastResult = result as Record<string, unknown>;
    if (result.status === 'applied' || result.status === 'noop') {
      const queue = edge.commandQueue || (edge.commandId ? [edge.commandId] : []);
      const next = nextEdgeAfterSuccess(edge.commandCursor, queue.length);
      edge.commandCursor = next.commandCursor;
      edge.status = next.status;
      await edgeRepo.save(edge);
      if (edge.status === 'armed') {
        await this.dispatchNext(edge);
      } else {
        await this.maybeCompletePlan(edge.planId);
      }
      return;
    }
    if (result.status === 'unavailable' && RETRYABLE.has(result.status)) {
      edge.status = result.reason === 'pluginMissing' ? 'blocked_plugin' : 'retryable_error';
      await edgeRepo.save(edge);
      return;
    }
    edge.status = edgeStatusFor(result);
    await edgeRepo.save(edge);
    if (edge.status === 'conflict' || edge.status === 'failed_terminal') {
      await this.openTicket(edge, attempt, result);
      const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: edge.planId });
      if (plan) {
        plan.status = 'conflict';
        await workflowStore().getRepository(WorkflowPlan).save(plan);
      }
    }
  }

  async dispatchNext(edge: WorkflowEdge): Promise<CommandResult | null> {
    const queue = edge.commandQueue || (edge.commandId ? [edge.commandId] : []);
    const next = queue[edge.commandCursor];
    if (!next) return null;
    if (edge.interactionId && edge.commandCursor === 0 && edge.status === 'armed') {
      edge.status = 'awaiting_interaction';
      await workflowStore().getRepository(WorkflowEdge).save(edge);
      const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: edge.planId });
      if (plan) {
        plan.status = 'awaiting_interaction';
        await workflowStore().getRepository(WorkflowPlan).save(plan);
      }
      return null;
    }
    edge.status = 'dispatching';
    await workflowStore().getRepository(WorkflowEdge).save(edge);
    const [pluginId, ...rest] = next.split('.');
    return this.runCommand({
      pluginId: pluginId || '',
      localId: rest.join('.'),
      commandInput: await this.commandInputFor(edge, next),
      planId: edge.planId,
      edgeId: edge.id,
      idempotencyKey: `${edge.id}:${edge.commandCursor}`,
    });
  }

  async submitInteraction(edgeId: string, input: Record<string, unknown>): Promise<CommandResult> {
    const edge = await workflowStore().getRepository(WorkflowEdge).findOneBy({ id: edgeId });
    if (!edge) return { status: 'notFound' };
    if (edge.status !== 'awaiting_interaction' && edge.status !== 'armed') {
      return { status: 'rejected', code: 'precondition', reason: 'edge is not awaiting interaction' };
    }
    const queue = edge.commandQueue || (edge.commandId ? [edge.commandId] : []);
    const next = queue[edge.commandCursor];
    if (!next) return { status: 'rejected', code: 'precondition', reason: 'no command queued' };
    const [pluginId, ...rest] = next.split('.');
    edge.interactionInput = input;
    edge.status = 'dispatching';
    await workflowStore().getRepository(WorkflowEdge).save(edge);
    return this.runCommand({
      pluginId: pluginId || '',
      localId: rest.join('.'),
      commandInput: { ...(await this.commandInputFor(edge, next)), ...input },
      planId: edge.planId,
      edgeId: edge.id,
      idempotencyKey: `${edge.id}:${edge.commandCursor}`,
    });
  }

  private async commandInputFor(edge: WorkflowEdge, commandId: string) {
    const nodeRepo = workflowStore().getRepository(WorkflowNode);
    const fromNode = await nodeRepo.findOneBy({ id: edge.fromNodeId });
    const base = { ...(edge.interactionInput || {}) };
    if (commandId.endsWith('.completeTodo')) {
      return { ...base, uri: fromNode?.outputUri, expectedRevision: fromNode?.outputRevision };
    }
    return base;
  }

  async openTicket(edge: WorkflowEdge, attempt: WorkflowCommandAttempt, result: CommandResult) {
    const repo = workflowStore().getRepository(WorkflowConflictTicket);
    const ticket = repo.create({
      ticketRevision: 1,
      planId: edge.planId,
      edgeId: edge.id,
      attemptId: attempt.id,
      commandId: attempt.commandId,
      targetUri: result.status === 'conflict' || result.status === 'applied' || result.status === 'noop' ? result.resource?.uri : undefined,
      expectedRevision: result.status === 'conflict' ? result.expectedRevision : undefined,
      actualRevision: result.status === 'conflict' ? result.actualRevision : undefined,
      resultStatus: result.status,
      reasonCode: result.status === 'rejected' ? result.code : result.status,
      reason: 'reason' in result ? String(result.reason || '') : result.status,
      succeededPredecessors: (edge.commandQueue || []).slice(0, edge.commandCursor),
      relatedUris: result.status === 'conflict' && result.resource?.uri ? [result.resource.uri] : [],
      allowedActions: [...CONFLICT_ACTIONS],
      diagnostic: redact(result.status === 'conflict' ? result.current : result) as Record<string, unknown>,
      status: 'open',
    });
    const saved = await repo.save(ticket);
    await notificationService.post({
      pluginId: 'workflow',
      title: '流程冲突',
      body: saved.reason || '有流程停下来需要处理。',
      href: '/workflow?tab=issues',
      uri: conflictResourceUri(saved.id),
      dedupeKey: `workflow.conflict:${saved.id}`,
    });
    return saved;
  }

  async resolveTicket(input: {
    ticketId: string;
    ticketRevision: number;
    action: ConflictAction;
    expectedRevision?: string;
    interactionInput?: Record<string, unknown>;
  }): Promise<CommandResult | { ok: true; status: string }> {
    const repo = workflowStore().getRepository(WorkflowConflictTicket);
    const ticket = await repo.findOneBy({ id: input.ticketId });
    if (!ticket || ticket.status !== 'open') {
      return { status: 'rejected', code: 'precondition', reason: 'ticket is not open' };
    }
    if (ticket.ticketRevision !== input.ticketRevision) {
      return { status: 'conflict', reason: 'ticket revision drifted', expectedRevision: String(ticket.ticketRevision) };
    }
    const edge = ticket.edgeId
      ? await workflowStore().getRepository(WorkflowEdge).findOneBy({ id: ticket.edgeId })
      : null;
    if (input.action === 'cancelPlan' && ticket.planId) {
      const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: ticket.planId });
      if (plan) {
        plan.status = 'cancelled';
        await workflowStore().getRepository(WorkflowPlan).save(plan);
      }
      if (edge) {
        edge.status = 'cancelled';
        await workflowStore().getRepository(WorkflowEdge).save(edge);
      }
      ticket.status = 'resolved';
      ticket.ticketRevision += 1;
      await repo.save(ticket);
      await notificationService.markReadByDedupeKey(`workflow.conflict:${ticket.id}`);
      return { ok: true, status: 'cancelled' };
    }
    if (input.action === 'skipEdge' && edge) {
      edge.status = 'cancelled';
      await workflowStore().getRepository(WorkflowEdge).save(edge);
      ticket.status = 'resolved';
      ticket.ticketRevision += 1;
      await repo.save(ticket);
      await notificationService.markReadByDedupeKey(`workflow.conflict:${ticket.id}`);
      await this.maybeCompletePlan(edge.planId);
      return { ok: true, status: 'skipped' };
    }
    if (input.action === 'acceptCurrent') {
      ticket.status = 'resolved';
      ticket.ticketRevision += 1;
      await repo.save(ticket);
      await notificationService.markReadByDedupeKey(`workflow.conflict:${ticket.id}`);
      if (edge) {
        edge.status = 'succeeded';
        await workflowStore().getRepository(WorkflowEdge).save(edge);
        await this.maybeCompletePlan(edge.planId);
      }
      return { ok: true, status: 'accepted' };
    }
    if ((input.action === 'retryWithRevision' || input.action === 'openInteraction') && edge) {
      const queue = edge.commandQueue || (edge.commandId ? [edge.commandId] : []);
      const next = queue[edge.commandCursor];
      if (!next) return { status: 'rejected', code: 'precondition', reason: 'no command queued' };
      const [pluginId, ...rest] = next.split('.');
      ticket.status = 'resolved';
      ticket.ticketRevision += 1;
      await repo.save(ticket);
      await notificationService.markReadByDedupeKey(`workflow.conflict:${ticket.id}`);
      const commandInput = {
        ...(input.interactionInput || {}),
        ...(input.expectedRevision ? { expectedRevision: input.expectedRevision } : {}),
      };
      return this.runCommand({
        pluginId: pluginId || '',
        localId: rest.join('.'),
        commandInput,
        planId: edge.planId,
        edgeId: edge.id,
        idempotencyKey: `${edge.id}:${edge.commandCursor}:${ticket.ticketRevision}`,
      });
    }
    return { status: 'rejected', code: 'policy', reason: 'unsupported action' };
  }

  async maybeCompletePlan(planId: string) {
    const edges = await workflowStore().getRepository(WorkflowEdge).findBy({ planId });
    const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: planId });
    if (!plan) return;
    const nextStatus = planStatusFor(edges);
    if (nextStatus) plan.status = nextStatus;
    await workflowStore().getRepository(WorkflowPlan).save(plan);
  }
}

export const workflowRunner = new WorkflowRunner();

export function pluginIdFromUri(uri?: string) {
  return parsePluginResourceUri(uri || '')?.pluginId;
}
