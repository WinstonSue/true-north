import type { AgentRule } from '@true-north/plugin-sdk';
import { GROWTH_RULE } from '../../../shared/entity-bounds';

const DECOMPOSE_GOAL_TOOLS = ['get_goal', 'decompose_goal'];
const DECOMPOSE_TASK_TOOLS = ['get_task', 'decompose_task'];

export const growthAiRules: AgentRule[] = [
  {
    id: GROWTH_RULE.goalPriority,
    tools: DECOMPOSE_GOAL_TOOLS,
    description: '子目标、任务、待办与习惯的重要度、难度不得超过当前目标；省略时继承当前目标的对应值。',
  },
  {
    id: GROWTH_RULE.goalTime,
    tools: DECOMPOSE_GOAL_TOOLS,
    description: '子目标、任务、待办与习惯的计划日期必须落在当前目标的开始/结束范围内。',
  },
  {
    id: GROWTH_RULE.goalType,
    tools: DECOMPOSE_GOAL_TOOLS,
    description: '指标目标只能拆出指标子目标；规划目标可拆出规划或指标子目标。拆解创建的子目标使用指标类型。',
  },
  {
    id: GROWTH_RULE.taskBounds,
    tools: DECOMPOSE_TASK_TOOLS,
    description: '子任务与待办的重要度、难度和计划日期不得超过当前任务；省略时继承当前任务的对应值。',
  },
  {
    id: GROWTH_RULE.taskSingleParent,
    tools: DECOMPOSE_TASK_TOOLS,
    description: '子任务以当前任务为唯一父级，不要再关联目标。',
  },
  {
    id: GROWTH_RULE.todoRelated,
    tools: [...DECOMPOSE_GOAL_TOOLS, ...DECOMPOSE_TASK_TOOLS],
    description: '待办建议需遵守关联目标或任务的时间与重要度边界；任务拆解产生的待办由系统关联当前任务。',
  },
  {
    id: GROWTH_RULE.habitGoalRequired,
    tools: DECOMPOSE_GOAL_TOOLS,
    description: '习惯建议只能在当前目标处于活跃状态（待办/进行中）时生成，并关联该目标。',
  },
];
