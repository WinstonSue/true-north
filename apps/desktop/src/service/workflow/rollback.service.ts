import type { CommandResult } from '@true-north/plugin-contract';
import { hostPrimitiveCatalog, splitContributionId } from './catalog';
import { workflowStore } from './storage';
import { WorkflowAssociation, WorkflowNodeState, WorkflowPlan, WorkflowWorkspace } from './entities';
import { graphOf, reverseCommandKeys } from './instance-graph';
import { workflowRunner } from './runner';
import { notificationService } from '../notification';

export class WorkflowRollbackService {
  async preview(owner: { ownerPluginId: string; ownerKind: string; ownerId: string }) {
    const associations = await workflowStore().getRepository(WorkflowAssociation).find({
      where: owner,
    });
    const plans: Array<Record<string, unknown>> = [];
    for (const association of associations) {
      const list = await workflowStore().getRepository(WorkflowPlan).find({
        where: { associationId: association.id },
        order: { createdAt: 'DESC' },
      });
      for (const plan of list) {
        if (plan.status === 'rolled_back' || plan.status === 'cancelled' || plan.status === 'drafting') continue;
        if (plan.sourceDetachedAt) continue;
        const nodes = await workflowStore().getRepository(WorkflowNodeState).findBy({ planId: plan.id });
        plans.push({
          id: plan.id,
          status: plan.status,
          definitionId: plan.definitionId,
          definitionVersion: plan.definitionVersion,
          startedAt: plan.startedAt,
          completedAt: plan.completedAt,
          appliedCommands: nodes.filter((node) => node.status === 'applied' && node.resource).length,
        });
      }
    }
    return { needsConfirm: plans.length > 0, plans };
  }

  async rollback(planId: string, confirmed: boolean) {
    if (!confirmed) {
      return { status: 'rejected', code: 'policy', reason: 'rollback requires confirmation' } satisfies CommandResult;
    }
    const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: planId });
    if (!plan) return { status: 'notFound' } satisfies CommandResult;
    if (plan.status === 'rolled_back') {
      return { status: 'noop', reason: 'alreadyApplied' } satisfies CommandResult;
    }
    const graph = graphOf(plan);
    plan.status = 'rolling_back';
    plan.rollbackStartedAt = new Date();
    await workflowStore().getRepository(WorkflowPlan).save(plan);
    const catalog = hostPrimitiveCatalog();
    const keys = reverseCommandKeys(graph);
    for (const key of keys) {
      const node = graph.nodes.find((item) => item.key === key);
      const state = await workflowStore().getRepository(WorkflowNodeState).findOneBy({ planId, nodeKey: key });
      if (!node || !state || state.status !== 'applied' || !state.resource) continue;
      const command = catalog.commands.get(node.contributionId);
      if (!command?.compensate) {
        state.status = 'conflict';
        await workflowStore().getRepository(WorkflowNodeState).save(state);
        plan.status = 'conflict';
        await workflowStore().getRepository(WorkflowPlan).save(plan);
        return {
          status: 'conflict',
          reason: `command ${node.contributionId} has no compensate`,
          resource: state.resource,
        } satisfies CommandResult;
      }
      state.status = 'compensating';
      await workflowStore().getRepository(WorkflowNodeState).save(state);
      const { pluginId, localId } = splitContributionId(command.compensate);
      const result = await workflowRunner.runCommand({
        pluginId,
        localId,
        commandInput: { uri: state.resource.uri, expectedRevision: state.resource.revision },
        planId,
        nodeId: state.id,
        idempotencyKey: `plan:${planId}:compensate:${key}`,
      });
      if (result.status === 'applied' || result.status === 'noop') {
        state.status = 'compensated';
        state.lastResult = result as Record<string, unknown>;
        await workflowStore().getRepository(WorkflowNodeState).save(state);
        continue;
      }
      state.status = result.status === 'conflict' ? 'conflict' : 'failed';
      state.lastResult = result as Record<string, unknown>;
      await workflowStore().getRepository(WorkflowNodeState).save(state);
      plan.status = 'conflict';
      await workflowStore().getRepository(WorkflowPlan).save(plan);
      return result;
    }
    const workspaces = await workflowStore().getRepository(WorkflowWorkspace).findBy({ planId });
    for (const workspace of workspaces) {
      if (workspace.status === 'pending' || workspace.status === 'open') {
        workspace.status = 'dismissed';
        await workflowStore().getRepository(WorkflowWorkspace).save(workspace);
        await notificationService.markReadByDedupeKey(`workflow.workspace:${workspace.id}`);
      }
    }
    plan.status = 'rolled_back';
    plan.rollbackCompletedAt = new Date();
    await workflowStore().getRepository(WorkflowPlan).save(plan);
    return { status: 'applied', output: { planId, status: 'rolled_back' } } satisfies CommandResult;
  }

  async detach(planId: string) {
    const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id: planId });
    if (!plan) return { status: 'notFound' } satisfies CommandResult;
    if (!plan.sourceDetachedAt) {
      plan.sourceDetachedAt = new Date();
      await workflowStore().getRepository(WorkflowPlan).save(plan);
    }
    return { status: 'applied', output: { planId, status: 'detached' } } satisfies CommandResult;
  }
}

export const workflowRollbackService = new WorkflowRollbackService();
