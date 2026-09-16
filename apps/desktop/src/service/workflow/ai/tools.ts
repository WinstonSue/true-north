import { z } from 'zod';
import { type AgentTool } from '@true-north/plugin-sdk';
import { composeWorkflow } from '../compose';
import { CONFLICT_ACTIONS } from '@true-north/plugin-contract';
import { getConflictTicket } from '../conflict';
import { evaluateConflictProposal } from './conflict-proposal.ts';

const composeSchema = z.object({
  nodes: z.array(
    z.object({
      workspaceId: z.string(),
      pluginId: z.string(),
      commandId: z.string(),
      input: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
  edges: z
    .array(
      z.object({
        fromWorkspaceId: z.string(),
        toWorkspaceId: z.string(),
        commands: z.array(z.string()),
        interactionId: z.string().optional(),
      }),
    )
    .optional(),
});

export const workflowComposeTool: AgentTool = {
  name: 'workflow.compose',
  description:
    '把已经通过各插件 suggest 工具返回的 workspaceId 连成计划。只校验和连接，不创建领域实体。不要把同一个提醒拆成物资加待办；入库与记账只有在用户明确同时表达数量和金额时才连接。',
  parameters: {
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            workspaceId: { type: 'string' },
            pluginId: { type: 'string' },
            commandId: { type: 'string' },
            input: { type: 'object' },
          },
          required: ['workspaceId', 'pluginId', 'commandId'],
        },
      },
      edges: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fromWorkspaceId: { type: 'string' },
            toWorkspaceId: { type: 'string' },
            commands: { type: 'array', items: { type: 'string' } },
            interactionId: { type: 'string' },
          },
          required: ['fromWorkspaceId', 'toWorkspaceId', 'commands'],
        },
      },
    },
    required: ['nodes'],
  },
  schema: composeSchema,
  async execute(args) {
    const result = await composeWorkflow(args);
    return JSON.stringify({
      ok: true,
      ...result,
      hint: '计划已保存。请提示用户在各插件工作台确认；确认前不要声称已经创建实体。',
    });
  },
};

const resolutionSchema = z.object({
  ticketId: z.string().min(1),
  ticketRevision: z.coerce.number(),
  resourceRevision: z.string().optional(),
  action: z.enum(CONFLICT_ACTIONS),
  reason: z.string().optional(),
});

export const workflowProposeConflictResolutionTool: AgentTool = {
  name: 'workflow.proposeConflictResolution',
  description:
    '只在冲突排查会话中使用。根据刚读取的工单与资源，生成解决建议工作台。不写领域库，不修改工单。',
  parameters: {
    type: 'object',
    properties: {
      ticketId: { type: 'string' },
      ticketRevision: { type: 'number' },
      resourceRevision: { type: 'string' },
      action: { type: 'string', enum: [...CONFLICT_ACTIONS] },
      reason: { type: 'string' },
    },
    required: ['ticketId', 'ticketRevision', 'action'],
  },
  schema: resolutionSchema,
  async execute(args, ctx) {
    const parsed = resolutionSchema.parse(args);
    const proposal = {
      ticketId: parsed.ticketId,
      ticketRevision: parsed.ticketRevision,
      resourceRevision: parsed.resourceRevision,
      action: parsed.action,
    };
    const ticket = await getConflictTicket(proposal.ticketId);
    const check = evaluateConflictProposal(proposal, ctx.conflictTicketId, ticket);
    if (check.ok === false) {
      throw new Error(check.reason);
    }
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: 'workflow.conflictResolution',
      payload: {
        ...parsed,
        stale: false,
      },
    });
    return JSON.stringify({
      ok: true,
      workspaceId,
      hint: '解决建议已写入工作台，等待用户在冲突面板确认。不要声称已经修复。',
    });
  },
};

export { CONFLICT_TOOL_ALLOWLIST } from './conflict-proposal';
