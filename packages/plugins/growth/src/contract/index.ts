import { contributionKey, pluginPath, pluginResourceUri } from '@true-north/plugin-contract';
import { growthManifest } from '../manifest';

export const GROWTH_PLUGIN_ID = growthManifest.pluginId;
export const growthPaths = {
  root: pluginPath(GROWTH_PLUGIN_ID),
} as const;

export const growthIds = {
  views: {
    todo: contributionKey(GROWTH_PLUGIN_ID, 'todo'),
    task: contributionKey(GROWTH_PLUGIN_ID, 'task'),
    habit: contributionKey(GROWTH_PLUGIN_ID, 'habit'),
    goal: contributionKey(GROWTH_PLUGIN_ID, 'goal'),
  },
  workspaces: {
    goalDecompose: contributionKey(GROWTH_PLUGIN_ID, 'goalDecompose'),
    taskDecompose: contributionKey(GROWTH_PLUGIN_ID, 'taskDecompose'),
  },
  skills: {
    goalDecompose: contributionKey(GROWTH_PLUGIN_ID, 'goalDecompose'),
    taskDecompose: contributionKey(GROWTH_PLUGIN_ID, 'taskDecompose'),
  },
  capture: {
    todo: contributionKey(GROWTH_PLUGIN_ID, 'todo'),
  },
} as const;

export const GROWTH_VIEW_TODO = growthIds.views.todo;
export const GROWTH_VIEW_TASK = growthIds.views.task;
export const GROWTH_VIEW_HABIT = growthIds.views.habit;
export const GROWTH_VIEW_GOAL = growthIds.views.goal;
export const GoalDecomposeKey = growthIds.workspaces.goalDecompose;
export const TaskDecomposeKey = growthIds.workspaces.taskDecompose;

export type GrowthArea = 'todo' | 'task' | 'habit' | 'goal';
export type GrowthTab = 'today' | 'calendar' | 'all' | 'list' | 'detail' | 'tree' | 'mindmap';

export type GrowthViewState = {
  tab?: GrowthTab;
  id?: string;
};

export function growthHref(view: { area?: GrowthArea } & GrowthViewState = {}): string {
  const params = new URLSearchParams();
  params.set('view', view.area || 'todo');
  if (view.tab) params.set('tab', view.tab);
  if (view.id) params.set('id', view.id);
  const query = params.toString();
  return `${growthPaths.root}?${query}`;
}

export function growthGoalUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'goals', id);
}

export function growthTaskUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'tasks', id);
}

export function growthHabitUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'habits', id);
}

export function growthTodoUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'todos', id);
}
