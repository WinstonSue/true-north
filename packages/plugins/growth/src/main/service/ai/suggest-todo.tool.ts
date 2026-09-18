import { z } from 'zod';
import type { AgentTool } from '@true-north/plugin-sdk';
import { growthIds } from '../../../contract';
import { normalizeSuggestTodoPayload } from '../../../shared/normalize-suggest-todo';

const schema = z.object({
  title: z.string().min(1),
  planned: z.string().optional(),
  plannedTime: z.string().optional(),
  note: z.string().optional(),
});

export const suggestTodoTool: AgentTool = {
  name: 'suggest_todo',
  description:
    '把提醒、计划去做的事理解成待办建议工作台。不要创建实体。「购买」只是动作动词。「9月17日提醒我购买汕头到深圳的高铁票」只生成待办。「9月19日上午10点提醒我购买珠海到顺德的高铁票」填 planned 为当前时间下最近一次尚未过去的该月日、plannedTime: 10:00，不要填 note。用户没说年份时必须用系统提供的当前日期推算，禁止用训练数据里的年份。「提醒我买两盒滤芯」只生成待办，除非用户同时要求记录库存。不要因为出现「买」就改用物资工具。高铁票、机票、酒店、服务、预约、缴费、订阅和数字权益永不进入物资。',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: '待办名称，只写要做的事，不要写日期和时刻。' },
      planned: {
        type: 'string',
        description:
          'YYYY-MM-DD。必须基于系统提供的当前日期。用户没说年份时取最近一次尚未过去的该月日，禁止用训练数据里的年份。',
      },
      plannedTime: {
        type: 'string',
        description: 'HH:mm。用户说上午10点则填 10:00。时刻只写在这里。',
      },
      note: {
        type: 'string',
        description: '仅当名称没覆盖的补充信息时填写。名称已足够或只是重复时刻时省略。',
      },
    },
    required: ['title'],
  },
  schema,
  async execute(args, ctx) {
    const payload = normalizeSuggestTodoPayload(schema.parse(args));
    const workspaceId = ctx.appendWorkspace({
      type: 'workspace',
      workspaceKey: growthIds.workspaces.suggestTodo,
      payload,
    });
    return JSON.stringify({
      ok: true,
      workspaceId,
      nodeId: workspaceId,
      hint: '待办建议已写入工作台，等待用户确认。不要声称已经创建。',
    });
  },
};
