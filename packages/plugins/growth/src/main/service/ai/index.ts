import type { AiContribution } from '@true-north/plugin-sdk';
import { goalDecomposeCapability } from './goal-decompose.capability';
import { taskDecomposeCapability } from './task-decompose.capability';
import { growthAgentTools } from './tools';
import { growthAiRules } from './rules';

export const growthAiContribution: AiContribution = {
  capabilities: [goalDecomposeCapability, taskDecomposeCapability],
  tools: growthAgentTools,
  rules: growthAiRules,
  agentInstructions: `通过 MCP 工具读写目标与任务：search_goals、search_tasks、get_goal、get_task、decompose_goal、decompose_task。
- 拆解必须先 get_goal / get_task 读取上下文与 Constraints/bounds，再调用 decompose_* 并传入你生成的 suggestions（及可选 analysisSummary）；不要只输出文本列表。
- suggestions 的 importance/difficulty/planned 必须遵守返回的 bounds；省略则继承上级。不要填写超出 maxImportance、maxDifficulty 或日期范围的值。`,
};
