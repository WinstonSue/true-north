import { Body, Controller, Get, Param, Post, Put, Query } from '@true-north/plugin-sdk/main';
import { workflowEventService } from './event.service';
import { workflowRunner } from './runner';
import { composeWorkflow } from './compose';
import { getConflictTicket, toTicketEvidence } from './conflict';
import { workflowStore } from './storage';
import { WorkflowConflictTicket, WorkflowEdge, WorkflowPlan } from './entities';
import type { ConflictAction } from '@true-north/plugin-contract';

@Controller('/workflow')
export class WorkflowController {
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
