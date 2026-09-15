import type { WorkbenchViewContribution } from '@true-north/plugin-sdk';
import {
  GROWTH_VIEW_GOAL,
  GROWTH_VIEW_HABIT,
  GROWTH_VIEW_TASK,
  GROWTH_VIEW_TODO,
} from '../contract';

export const growthWorkbenchViews: WorkbenchViewContribution[] = [
  {
    id: GROWTH_VIEW_TODO,
    pluginId: 'growth',
    nameKey: 'menu.todo',
    order: 10,
    load: () => import('./features/todo'),
  },
  {
    id: GROWTH_VIEW_TASK,
    pluginId: 'growth',
    nameKey: 'menu.task',
    order: 20,
    load: () => import('./features/task'),
  },
  {
    id: GROWTH_VIEW_HABIT,
    pluginId: 'growth',
    nameKey: 'menu.habit',
    order: 30,
    load: () => import('./features/habit'),
  },
  {
    id: GROWTH_VIEW_GOAL,
    pluginId: 'growth',
    nameKey: 'menu.goal',
    order: 40,
    load: () => import('./features/goal'),
  },
];
