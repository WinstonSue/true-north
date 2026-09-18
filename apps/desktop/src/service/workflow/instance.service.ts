import { randomUUID } from 'crypto';
import {
  parsePluginResourceUri,
  type CommandResult,
  type WorkflowDefinitionGraph,
} from '@true-north/plugin-contract';
import { workspaceAdoptKey } from '@true-north/plugin-sdk/main';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { workflowStore } from './storage';
import {
  WorkflowAssociation,
  WorkflowNodeState,
  WorkflowPlan,
  WorkflowWorkspace,
} from './entities';
import { boundInputFor, withNodeOutput, type BindingContext } from './bindings';
import { splitContributionId } from './catalog';
import { workflowAssociationService } from './association.service';
import { workflowRunner } from './runner';
import { graphOf } from './instance-graph';
import { notificationService } from '../notification';

function singular(collection: string) {
  return collection.endsWith('s') ? collection.slice(0, -1) : collection;
}

function successors(graph: WorkflowDefinitionGraph, from: string) {
  return graph.edges.filter((edge) => edge.from === from).map((edge) => edge.to);
}

function eventCtx(plan: WorkflowPlan): BindingContext {
  const payload = (plan.meta?.eventPayload || {}) as Record<string, unknown>;
  return { event: { payload }, nodes: (plan.meta?.nodeOutputs as BindingContext['nodes']) || {} };
}

export class WorkflowInstanceService {
  private plans() {
    return workflowStore().getRepository(WorkflowPlan);
  }

  private states() {
    return workflowStore().getRepository(WorkflowNodeState);
  }

  private workspaces() {
    return workflowStore().getRepository(WorkflowWorkspace);
  }

  async list(filter?: { status?: string; associationId?: string; definitionId?: string }) {
    const qb = this.plans().createQueryBuilder('plan').orderBy('plan.createdAt', 'DESC');
    if (filter?.status) qb.andWhere('plan.status = :status', { status: filter.status });
    if (filter?.associationId) qb.andWhere('plan.associationId = :associationId', { associationId: filter.associationId });
    if (filter?.definitionId) qb.andWhere('plan.definitionId = :definitionId', { definitionId: filter.definitionId });
    const list = await qb.getMany();
    return list.map((plan) => ({
      id: plan.id,
      status: plan.status,
      definitionId: plan.definitionId,
      definitionVersion: plan.definitionVersion,
      associationId: plan.associationId,
      triggerEventId: plan.triggerEventId,
      startedAt: plan.startedAt,
      completedAt: plan.completedAt,
      rollbackCompletedAt: plan.rollbackCompletedAt,
      meta: plan.meta,
    }));
  }

  async get(id: string) {
    const plan = await this.plans().findOneBy({ id });
    if (!plan) return null;
    const nodes = await this.states().findBy({ planId: id });
    const workspaces = await this.workspaces().findBy({ planId: id });
    return { plan, nodes, workspaces };
  }

  async startFromEvent(event: {
    id: string;
    type: string;
    payload: Record<string, unknown>;
    sourceUri?: string;
  }) {
    const associations = await this.associationsFor(event);
    const started: string[] = [];
    for (const association of associations) {
      if (!association.enabled) continue;
      const published = await workflowAssociationService.resolvePublished(association);
      if (!published) continue;
      if (published.graph.start.eventContributionId !== event.type) continue;
      const existing = await this.plans().findOneBy({
        associationId: association.id,
        triggerEventId: event.id,
      });
      if (existing) continue;
      const plan = await this.materialize(association, published.graph, published.version, event);
      started.push(plan.id);
    }
    return started;
  }

  private async associationsFor(event: {
    payload: Record<string, unknown>;
    sourceUri?: string;
  }): Promise<WorkflowAssociation[]> {
    const parsed = parsePluginResourceUri(event.sourceUri || '');
    if (parsed?.id) {
      const own = await workflowAssociationService.findByOwner({
        ownerPluginId: parsed.pluginId,
        ownerKind: singular(parsed.collection),
        ownerId: parsed.id,
      });
      if (own) return [own];
    }
    const templateId = event.payload.templateId || event.payload.repeatId;
    if (typeof templateId === 'string') {
      const parent = await workflowAssociationService.findByOwner({
        ownerPluginId: parsed?.pluginId || 'growth',
        ownerKind: 'todo',
        ownerId: templateId,
      });
      if (parent) return [parent];
    }
    return [];
  }

  private async materialize(
    association: WorkflowAssociation,
    graph: WorkflowDefinitionGraph,
    version: number,
    event: { id: string; type: string; payload: Record<string, unknown>; sourceUri?: string },
  ) {
    const plan = await this.plans().save(
      this.plans().create({
        status: 'running',
        associationId: association.id,
        definitionId: association.definitionId,
        definitionVersion: version,
        triggerEventId: event.id,
        startedAt: new Date(),
        correlationId: event.id,
        meta: {
          graph,
          eventType: event.type,
          eventPayload: event.payload,
          sourceUri: event.sourceUri,
          nodeOutputs: {},
        },
      }),
    );
    for (const node of graph.nodes) {
      await this.states().save(
        this.states().create({
          planId: plan.id,
          nodeKey: node.key,
          status: 'pending',
        }),
      );
    }
    await this.advance(plan.id, 'start');
    return plan;
  }

  async advance(planId: string, fromKey: string) {
    const plan = await this.plans().findOneBy({ id: planId });
    if (!plan || plan.status === 'rolled_back' || plan.status === 'cancelled') return;
    const graph = graphOf(plan);
    const nextKeys = successors(graph, fromKey);
    if (!nextKeys.length && fromKey !== 'start') {
      await this.maybeComplete(planId);
      return;
    }
    for (const key of nextKeys) {
      const node = graph.nodes.find((item) => item.key === key);
      if (!node) continue;
      const state = await this.states().findOneBy({ planId, nodeKey: key });
      if (state && state.status !== 'pending' && state.status !== 'waiting') continue;
      if (node.kind === 'workspace') {
        await this.openWorkspace(plan, node.key, node.contributionId);
        continue;
      }
      if (node.kind === 'command') {
        await this.runNodeCommand(plan, node.key, node.contributionId);
        continue;
      }
    }
    await this.maybeComplete(planId);
  }

  private async openWorkspace(plan: WorkflowPlan, nodeKey: string, contributionId: string) {
    const graph = graphOf(plan);
    const ctx = eventCtx(plan);
    const input = boundInputFor(nodeKey, graph.bindings || [], ctx);
    const workspaceId = randomUUID();
    const commandSuccessor = successors(graph, nodeKey)
      .map((key) => graph.nodes.find((node) => node.key === key))
      .find((node) => node?.kind === 'command');
    const command = commandSuccessor
      ? splitContributionId(commandSuccessor.contributionId)
      : splitContributionId(contributionId);
    const workspace = this.workspaces().create({
      id: workspaceId,
      planId: plan.id,
      nodeKey,
      contributionId,
      state: {
        ...input,
        planId: plan.id,
        nodeKey,
        workflowWorkspaceId: workspaceId,
      },
      status: 'pending',
      adoptKey: workspaceAdoptKey(workspaceId, command.pluginId, command.localId),
    });
    await this.workspaces().save(workspace);
    const title = typeof input.title === 'string' && input.title.trim() ? input.title.trim() : '待确认';
    await notificationService.post({
      pluginId: 'workflow',
      title: `待确认：${title}`,
      body: '有流程需要你确认后才会继续。',
      hostAction: HOST_WORKFLOW_OPEN_PENDING,
      href: '/workflow?tab=runs',
      dedupeKey: `workflow.workspace:${workspaceId}`,
    });
    const state = await this.states().findOneBy({ planId: plan.id, nodeKey });
    if (state) {
      state.status = 'waiting';
      state.input = input;
      await this.states().save(state);
    }
    plan.status = 'awaiting_interaction';
    await this.plans().save(plan);
  }

  private async runNodeCommand(plan: WorkflowPlan, nodeKey: string, contributionId: string) {
    const graph = graphOf(plan);
    const ctx = eventCtx(plan);
    const input = boundInputFor(nodeKey, graph.bindings || [], ctx);
    const { pluginId, localId } = splitContributionId(contributionId);
    const state = await this.states().findOneBy({ planId: plan.id, nodeKey });
    if (state) {
      state.status = 'waiting';
      state.input = input;
      await this.states().save(state);
    }
    const result = await workflowRunner.runCommand({
      pluginId,
      localId,
      commandInput: input,
      planId: plan.id,
      nodeId: state?.id,
      idempotencyKey: `plan:${plan.id}:node:${nodeKey}`,
    });
    await this.recordCommand(plan.id, nodeKey, result, input);
    if (result.status === 'applied' || result.status === 'noop') {
      await this.advance(plan.id, nodeKey);
    } else if (result.status === 'conflict') {
      plan.status = 'conflict';
      await this.plans().save(plan);
    }
  }

  private async recordCommand(
    planId: string,
    nodeKey: string,
    result: CommandResult,
    input?: Record<string, unknown>,
  ) {
    const state = await this.states().findOneBy({ planId, nodeKey });
    if (!state) return;
    state.lastResult = result as Record<string, unknown>;
    if (input) state.input = input;
    if (result.status === 'applied' || result.status === 'noop') {
      state.status = 'applied';
      state.output = 'output' in result ? result.output : undefined;
      state.resource = result.resource;
    } else if (result.status === 'conflict') {
      state.status = 'conflict';
    } else {
      state.status = 'failed';
    }
    await this.states().save(state);
    const plan = await this.plans().findOneBy({ id: planId });
    if (!plan) return;
    const outputs = {
      ...((plan.meta?.nodeOutputs as BindingContext['nodes']) || {}),
      [nodeKey]: { input: state.input, output: state.output || state.input },
    };
    plan.meta = { ...(plan.meta || {}), nodeOutputs: outputs };
    await this.plans().save(plan);
  }

  async onWorkspaceCommand(
    workspaceId: string,
    result: CommandResult,
    input: unknown,
  ) {
    if (result.status !== 'applied' && result.status !== 'noop') return;
    const workspace = await this.workspaces().findOneBy({ id: workspaceId });
    if (!workspace || workspace.status === 'adopted') return;
    workspace.status = 'adopted';
    workspace.adoptedAt = new Date();
    workspace.state = {
      ...workspace.state,
      ...(typeof input === 'object' && input ? (input as Record<string, unknown>) : {}),
      adopted: true,
      resource: result.resource,
    };
    await this.workspaces().save(workspace);
    await notificationService.markReadByDedupeKey(`workflow.workspace:${workspaceId}`);
    const plan = await this.plans().findOneBy({ id: workspace.planId });
    if (!plan) return;
    const graph = graphOf(plan);
    const draft = workspace.state;
    const waiting = await this.states().findOneBy({ planId: plan.id, nodeKey: workspace.nodeKey });
    if (waiting) {
      waiting.status = 'applied';
      waiting.output = draft;
      await this.states().save(waiting);
    }
    const nextCtx = withNodeOutput(eventCtx(plan), workspace.nodeKey, draft);
    plan.meta = { ...(plan.meta || {}), nodeOutputs: nextCtx.nodes };
    plan.status = 'running';
    await this.plans().save(plan);
    const commandId = result.status === 'applied' || result.status === 'noop' ? undefined : undefined;
    void commandId;
    for (const key of successors(graph, workspace.nodeKey)) {
      const node = graph.nodes.find((item) => item.key === key);
      if (node?.kind === 'command') {
        const { pluginId, localId } = splitContributionId(node.contributionId);
        const expected =
          typeof (input as { pluginId?: string })?.pluginId === 'string'
            ? ''
            : `${pluginId}.${localId}`;
        void expected;
        await this.recordCommand(plan.id, key, result, typeof input === 'object' ? (input as Record<string, unknown>) : undefined);
        await this.advance(plan.id, key);
      } else {
        await this.advance(plan.id, workspace.nodeKey);
      }
    }
    await this.maybeComplete(plan.id);
  }

  async listPendingWorkspaces() {
    const list = await this.workspaces().find({
      where: [{ status: 'pending' }, { status: 'open' }],
      order: { createdAt: 'ASC' },
    });
    return list.map((item) => ({
      id: item.id,
      planId: item.planId,
      nodeKey: item.nodeKey,
      contributionId: item.contributionId,
      state: item.state,
      status: item.status,
      adoptKey: item.adoptKey,
    }));
  }

  async getWorkspace(id: string) {
    const item = await this.workspaces().findOneBy({ id });
    if (!item) return null;
    return {
      id: item.id,
      planId: item.planId,
      nodeKey: item.nodeKey,
      contributionId: item.contributionId,
      state: item.state,
      status: item.status,
    };
  }

  async patchWorkspace(id: string, state: Record<string, unknown>) {
    const item = await this.workspaces().findOneBy({ id });
    if (!item) throw new Error('workspace not found');
    item.state = { ...item.state, ...state };
    if (item.status === 'pending') item.status = 'open';
    await this.workspaces().save(item);
    return item.state;
  }

  private async maybeComplete(planId: string) {
    const plan = await this.plans().findOneBy({ id: planId });
    if (!plan || plan.status === 'rolled_back' || plan.status === 'cancelled' || plan.status === 'conflict') return;
    const graph = graphOf(plan);
    const states = await this.states().findBy({ planId });
    const byKey = new Map(states.map((item) => [item.nodeKey, item]));
    const waiting = states.some((item) => item.status === 'waiting');
    if (waiting) {
      plan.status = 'awaiting_interaction';
      await this.plans().save(plan);
      return;
    }
    const commandKeys = graph.nodes.filter((node) => node.kind === 'command' || node.kind === 'workspace').map((node) => node.key);
    const allDone = commandKeys.every((key) => {
      const status = byKey.get(key)?.status;
      return status === 'applied' || status === 'skipped' || status === 'compensated';
    });
    if (allDone && commandKeys.length) {
      plan.status = 'completed';
      plan.completedAt = new Date();
      await this.plans().save(plan);
    }
  }
}

export const workflowInstanceService = new WorkflowInstanceService();
