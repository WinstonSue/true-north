import { contributionKey } from '@true-north/plugin-contract';

export const GROWTH_PLUGIN_ID = 'growth';

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
    suggestTodo: contributionKey(GROWTH_PLUGIN_ID, 'suggestTodo'),
  },
  skills: {
    goalDecompose: contributionKey(GROWTH_PLUGIN_ID, 'goalDecompose'),
    taskDecompose: contributionKey(GROWTH_PLUGIN_ID, 'taskDecompose'),
  },
  capture: {
    todo: contributionKey(GROWTH_PLUGIN_ID, 'todo'),
  },
  commands: {
    createTodo: contributionKey(GROWTH_PLUGIN_ID, 'createTodo'),
  },
} as const;
