import { contributionKey } from '@true-north/plugin-contract';

export const GROWTH_PLUGIN_ID = 'growth';

export const growthIds = {
  resources: {
    goal: contributionKey(GROWTH_PLUGIN_ID, 'goal'),
    task: contributionKey(GROWTH_PLUGIN_ID, 'task'),
    todo: contributionKey(GROWTH_PLUGIN_ID, 'todo'),
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
