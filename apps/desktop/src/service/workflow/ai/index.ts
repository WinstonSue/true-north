import type { AgentTool, PluginResourceProvider } from '@true-north/plugin-sdk';
import { resolvePluginPackageRoot, resolveSkillRoots } from '@true-north/plugin-sdk/main';
import { workflowComposeTool, workflowProposeConflictResolutionTool } from './tools';
import { getConflictTicket, toTicketEvidence } from '../conflict';
import { parseConflictResourceUri, WORKFLOW_CONFLICT_SKILL_LOCAL_ID } from '../../../plugin/host-ids';

export const workflowSkillRoots = resolveSkillRoots(
  resolvePluginPackageRoot('true-north-desktop', import.meta.url),
  { [WORKFLOW_CONFLICT_SKILL_LOCAL_ID]: { root: 'skills/conflict-assist' } },
);

export const workflowConflictResource: PluginResourceProvider = {
  async list() {
    return [];
  },
  async read(uri) {
    const ticketId = parseConflictResourceUri(uri);
    if (!ticketId) return null;
    const ticket = await getConflictTicket(ticketId);
    if (!ticket) return null;
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(toTicketEvidence(ticket)),
    };
  },
};

export const workflowAiContribution = {
  tools: [workflowComposeTool, workflowProposeConflictResolutionTool] as AgentTool[],
  agentInstructions: `当用户要记下生活里的事时，按意图调用对应插件的 suggest 工具，而不是直接创建实体。
- 提醒、计划去做某事：一律优先 growth.suggestTodo。「购买」只是动作动词，不能自动触发物资。
- 已发生的支出/收入：expense.suggestTransaction
- 只有明确的家庭实物库存、位置、入库、消耗、盘点或阈值意图才调用 inventory.suggestItem 或 inventory.suggestMovement
- 收藏网址：library.suggestBookmark
高铁票、机票、酒店、服务、预约、缴费、订阅和数字权益永不进入物资。
「9月17日提醒我购买汕头到深圳的高铁票」只生成待办。
「9月19日上午10点提醒我购买珠海到顺德的高铁票」只生成待办，planned 按当前时间取最近一次尚未过去的该月日，plannedTime 填 10:00，不要填 note。用户没说年份时不要用训练数据里的年份。
「提醒我买两盒滤芯」只生成待办，除非用户同时要求记录库存。
「家里滤芯剩1个，低于2个要补到4个」才调用物资。
「刚入库2盒滤芯，花了80元」才分别生成物资变动建议和记账建议。
一句里有多件事，只在用户明确表达多个独立事实时才调用多个 suggest 工具，不要把同一个提醒拆成多个领域记录。
物资入库与记账是两个独立事实。若建议之间有关联，再调用 workflow.compose 连接 workspaceId。生成不等于采纳。每个建议工作台只采纳一次。`,
  skillRoots: workflowSkillRoots,
};
