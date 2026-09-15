import { GoalService, TaskService } from '../../../client';
import { GROWTH_VIEW_GOAL, GROWTH_VIEW_TASK } from '@true-north/plugin-growth/contract';
import type { AiEntitySource } from '@true-north/plugin-sdk';

export const growthEntitySources: AiEntitySource[] = [
  {
    type: 'goal',
    kindLabel: '目标',
    boundKindLabel: '目标',
    searchParam: 'goalId',
    workbenchViewId: GROWTH_VIEW_GOAL,
    async list() {
      const result = await GoalService.findByFilter({});
      return (result?.list || []).map((goal) => ({ type: 'goal', id: goal.id, label: goal.name }));
    },
    async find(id: string) {
      try {
        const goal = await GoalService.find(id);
        return goal?.id ? { type: 'goal', id: goal.id, label: goal.name } : null;
      } catch {
        return null;
      }
    },
  },
  {
    type: 'task',
    kindLabel: '任务',
    boundKindLabel: '任务',
    searchParam: 'taskId',
    workbenchViewId: GROWTH_VIEW_TASK,
    async list() {
      const result = await TaskService.findByFilter({});
      return (result?.list || []).map((task) => ({ type: 'task', id: task.id, label: task.name }));
    },
    async find(id: string) {
      try {
        const task = await TaskService.find(id);
        return task?.id ? { type: 'task', id: task.id, label: task.name } : null;
      } catch {
        return null;
      }
    },
  },
];
