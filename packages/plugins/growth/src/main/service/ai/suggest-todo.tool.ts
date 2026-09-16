import { z } from 'zod';
import type { AgentTool } from '@true-north/plugin-sdk';
import { growthIds } from '../../../contract';

const schema = z.object({
  title: z.string().min(1),
  planned: z.string().optional(),
  note: z.string().optional(),
});

export const suggestTodoTool: AgentTool = {
  name: 'suggest_todo',
  description:
    '把提醒、计划去做的事理解成待办建议工作台。不要创建实体。「购买」只是动作动词。「9月17日提醒我购买汕头到深圳的高铁票」只生成待办。「提醒我买两盒滤芯」只生成待办，除非用户同时要求记录库存。不要因为出现「买」就改用物资工具。高铁票、机票、酒店、服务、预约、缴费、订阅和数字权益永不进入物资。',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      planned: { type: 'string', description: 'YYYY-MM-DD' },
      note: { type: 'string' },
    },
    required: ['title'],
  },
  schema,
  async execute(args, ctx) {
    const parsed = schema.parse(args);
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: growthIds.workspaces.suggestTodo,
      payload: parsed,
    });
    return JSON.stringify({
      ok: true,
      workspaceId,
      nodeId: workspaceId,
      hint: '待办建议已写入工作台，等待用户确认。不要声称已经创建。',
    });
  },
};
