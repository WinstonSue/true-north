import { Body, Controller, Get, Param, Post, Put, Query } from '@true-north/plugin-sdk/main';
import { workflowEventService } from './event.service';
import { workflowRunner } from './runner';
import { composeWorkflow } from './compose';
import { getConflictTicket, toTicketEvidence } from './conflict';
import { workflowStore } from './storage';
import { WorkflowConflictTicket, WorkflowEdge, WorkflowPlan } from './entities';
import type { ConflictAction } from '@true-north/plugin-contract';
import { workflowDefinitionService } from './definition.service';
import { workflowAssociationService } from './association.service';
import { workflowInstanceService } from './instance.service';
import { workflowRollbackService } from './rollback.service';

@Controller('/workflow')
export class WorkflowController {
  @Get('/catalog', { description: '原语与密封模板目录' })
  async catalog() {
    await workflowDefinitionService.importPluginTemplates();
    return workflowDefinitionService.catalog();
  }

  @Get('/definitions', { description: 'Workflow 定义列表' })
  async definitions() {
    await workflowDefinitionService.importPluginTemplates();
    return { list: await workflowDefinitionService.list() };
  }

  @Post('/definitions', { description: '创建 Workflow 定义草稿' })
  async createDefinition(
    @Body() body: { title: string; description?: string; graph?: unknown; sourceTemplateKey?: string },
  ) {
    return workflowDefinitionService.create(body);
  }

  @Get('/definitions/:id', { description: '读取 Workflow 定义' })
  async definition(@Param('id') id: string) {
    const item = await workflowDefinitionService.get(id);
    if (!item) throw new Error('definition not found');
    return item;
  }

  @Put('/definitions/:id', { description: '保存 Workflow 定义草稿' })
  async updateDefinition(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; graph?: unknown },
  ) {
    return workflowDefinitionService.update(id, body);
  }

  @Post('/definitions/:id/publish', { description: '发布不可变版本' })
  async publishDefinition(@Param('id') id: string) {
    return workflowDefinitionService.publish(id);
  }

  @Get('/associations', { description: '资源与已发布定义的关联' })
  async associations(
    @Query() query?: { ownerPluginId?: string; ownerKind?: string; ownerId?: string; definitionId?: string },
  ) {
    return { list: await workflowAssociationService.list(query) };
  }

  @Put('/associations', { description: '写入或清除关联' })
  async upsertAssociation(
    @Body()
    body: {
      ownerPluginId: string;
      ownerKind: string;
      ownerId: string;
      definitionId: string | null;
      versionPolicy?: 'latest_published' | 'pinned';
      pinnedVersion?: number;
      enabled?: boolean;
    },
  ) {
    return workflowAssociationService.upsert(body);
  }

  @Get('/plans', { description: 'Workflow 实例列表' })
  async planList(@Query() query?: { status?: string; associationId?: string; definitionId?: string }) {
    return { list: await workflowInstanceService.list(query) };
  }

  @Get('/workspaces', { description: '待确认的持久工作区' })
  async workspaces() {
    return { list: await workflowInstanceService.listPendingWorkspaces() };
  }

  @Get('/workspaces/:id', { description: '读取持久工作区' })
  async workspace(@Param('id') id: string) {
    const item = await workflowInstanceService.getWorkspace(id);
    if (!item) throw new Error('workspace not found');
    return item;
  }

  @Put('/workspaces/:id', { description: '保存持久工作区草稿' })
  async patchWorkspace(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { state: await workflowInstanceService.patchWorkspace(id, body || {}) };
  }

  @Get('/rollback/preview', { description: '回滚确认预览' })
  async rollbackPreview(
    @Query() query: { ownerPluginId: string; ownerKind: string; ownerId: string },
  ) {
    return workflowRollbackService.preview(query);
  }

  @Post('/plans/:id/rollback', { description: '确认后逆序补偿' })
  async rollbackPlan(@Param('id') id: string, @Body() body?: { confirmed?: boolean }) {
    return workflowRollbackService.rollback(id, body?.confirmed === true);
  }

  @Post('/plans/:id/detach', { description: '保留流程结果并与来源待办分离' })
  async detachPlan(@Param('id') id: string) {
    return workflowRollbackService.detach(id);
  }

  @Get('/events', { description: '领域事件时间线' })
  async events(
    @Query() query?: { pluginId?: string; keyword?: string; from?: string; to?: string; uri?: string },
  ) {
    return { list: await workflowEventService.list(query) };
  }

  @Post('/commands/run', { description: '执行已声明的工作流命令' })
  async run(
    @Body()
    body: {
      pluginId: string;
      localId: string;
      input?: unknown;
      planId?: string;
      nodeId?: string;
      workspaceId?: string;
      edgeId?: string;
      idempotencyKey?: string;
    },
  ) {
    return workflowRunner.runCommand({
      pluginId: body.pluginId,
      localId: body.localId,
      commandInput: body.input,
      planId: body.planId,
      nodeId: body.nodeId,
      workspaceId: body.workspaceId,
      edgeId: body.edgeId,
      idempotencyKey: body.idempotencyKey,
    });
  }

  @Post('/compose', { description: '连接建议工作台为计划' })
  async compose(@Body() body: unknown) {
    return composeWorkflow(body);
  }

  @Get('/plans/:id', { description: '读取工作流计划' })
  async plan(@Param('id') id: string) {
    const detail = await workflowInstanceService.get(id);
    if (detail) return detail;
    const plan = await workflowStore().getRepository(WorkflowPlan).findOneBy({ id });
    if (!plan) throw new Error('plan not found');
    const edges = await workflowStore().getRepository(WorkflowEdge).findBy({ planId: id });
    return { plan, edges };
  }

  @Get('/pending', { description: '等待用户确认的交互门' })
  async pending() {
    return { list: await workflowRunner.listPending() };
  }

  @Post('/edges/:id/interact', { description: '提交交互门结果' })
  async interact(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return workflowRunner.submitInteraction(id, body || {});
  }

  @Get('/conflicts', { description: '打开的冲突工单' })
  async conflicts() {
    const list = await workflowStore().getRepository(WorkflowConflictTicket).find({
      where: { status: 'open' },
      order: { updatedAt: 'DESC' },
    });
    return { list: list.map(toTicketEvidence) };
  }

  @Get('/conflicts/:id', { description: '冲突工单详情' })
  async conflict(@Param('id') id: string) {
    const ticket = await getConflictTicket(id);
    if (!ticket) throw new Error('ticket not found');
    return toTicketEvidence(ticket);
  }

  @Put('/conflicts/:id/resolve', { description: '人工或 AI 建议后的冲突处理' })
  async resolve(
    @Param('id') id: string,
    @Body()
    body: {
      ticketRevision: number;
      action: ConflictAction;
      expectedRevision?: string;
      interactionInput?: Record<string, unknown>;
    },
  ) {
    return workflowRunner.resolveTicket({
      ticketId: id,
      ticketRevision: body.ticketRevision,
      action: body.action,
      expectedRevision: body.expectedRevision,
      interactionInput: body.interactionInput,
    });
  }
}
