import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const growthManifest = definePluginManifest({
  pluginId: 'growth',
  version,
  catalog: {
    nameKey: 'menu.growth',
    descriptionKey: 'growth.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['todo', 'task', 'habit', 'goal', '待办', '任务', '习惯', '目标'],
    order: 10,
  },
  contributions: {
    ipc: {
      goal: {},
      task: {},
      todo: {},
      habit: {},
      trackTime: {},
    },
    views: {
      todo: { nameKey: 'menu.todo', order: 10 },
      task: { nameKey: 'menu.task', order: 20 },
      habit: { nameKey: 'menu.habit', order: 30 },
      goal: { nameKey: 'menu.goal', order: 40 },
    },
    page: {},
    workbench: {
      workspaces: {
        goalDecompose: {},
        taskDecompose: {},
      },
    },
    activity: {
      captureTypes: { todo: {} },
      today: {
        focusTimer: { kind: 'timer', titleKey: 'today.focus', order: 5 },
        focus: { kind: 'metric', titleKey: 'today.focus', order: 10, unit: 'seconds' },
        todos: { kind: 'list', titleKey: 'menu.todo', order: 20 },
        habits: { kind: 'list', titleKey: 'menu.habit', order: 30 },
      },
    },
    shell: {
      slots: {
        focusTimer: { slot: 'app-providers', order: 30 },
        taskDrawer: { slot: 'page-overlay', order: 10 },
        focusAction: { slot: 'aside-actions', order: 10 },
      },
    },
    ai: {
      skills: {
        goalDecompose: { root: 'skills/goal-decompose' },
        taskDecompose: { root: 'skills/task-decompose' },
      },
      mcp: {
        tools: {
          searchGoals: { readOnly: true },
          searchTasks: { readOnly: true },
          getGoal: { readOnly: true },
          getTask: { readOnly: true },
          decomposeGoal: {},
          decomposeTask: {},
        },
        resources: {
          goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } },
          task: { uriTemplate: 'tn://growth/tasks/{id}', mention: { labelKey: 'menu.task', order: 20 } },
        },
      },
    },
  },
});

export default growthManifest;
