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
      todo: { nameKey: 'menu.todo' },
      task: { nameKey: 'menu.task' },
      habit: { nameKey: 'menu.habit' },
      goal: { nameKey: 'menu.goal' },
    },
    hub: {},
    workbench: {
      workspaces: {
        goalDecompose: {},
        taskDecompose: {},
        suggestTodo: {},
      },
      newTabs: {
        todo: { order: 10 },
        task: { order: 20 },
        habit: { order: 30 },
        goal: { order: 40 },
      },
    },
    workflow: {
      events: {
        todoCreated: { payloadSchema: { type: 'object' } },
        todoCompleted: { payloadSchema: { type: 'object' } },
        todoUpdated: { payloadSchema: { type: 'object' } },
        todoDeleted: { payloadSchema: { type: 'object' } },
      },
      commands: {
        createTodo: { inputSchema: { type: 'object' }, idempotent: true },
        completeTodo: { inputSchema: { type: 'object' }, idempotent: true },
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
          suggestTodo: {},
        },
        resources: {
          goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } },
          task: { uriTemplate: 'tn://growth/tasks/{id}', mention: { labelKey: 'menu.task', order: 20 } },
          todo: { uriTemplate: 'tn://growth/todos/{id}' },
        },
      },
    },
  },
});

export default growthManifest;
