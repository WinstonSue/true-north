import { defineMainImplementation, type PluginMainContext } from '@true-north/plugin-sdk';
import { resolvePluginPackageRoot, resolveSkillRoots } from '@true-north/plugin-sdk/main';
import { growthManifest } from '../manifest';
import { GoalController } from './service/goal/goal.route-controller';
import { HabitController } from './service/habit/habit.route-controller';
import { TaskController } from './service/task/task.route-controller';
import { TodoController } from './service/todo/todo.route-controller';
import { TrackTimeController } from './service/track-time/track-time.route-controller';
import { growthMcpTools } from './service/ai/tools';
import { growthGoalResource, growthTaskResource, growthTodoResource } from './service/ai/resources';
import { bindGrowthContext } from './context';
import { activateStorage, disposeStorage } from './storage';
import { completeTodoCommand, createTodoCommand } from './service/todo/workflow.commands';

const skillRoots = resolveSkillRoots(
  resolvePluginPackageRoot('@true-north/plugin-growth', import.meta.url),
  growthManifest.contributions.ai?.skills,
);

export function createGrowthMain() {
  return defineMainImplementation(growthManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindGrowthContext(ctx);
      return {
        ipc: {
          goal: { controller: new GoalController() },
          task: { controller: new TaskController() },
          todo: { controller: new TodoController() },
          habit: { controller: new HabitController() },
          trackTime: { controller: new TrackTimeController() },
        },
        workflow: {
          commands: {
            createTodo: createTodoCommand,
            completeTodo: completeTodoCommand,
          },
        },
        ai: {
          mcp: {
            tools: growthMcpTools,
            resources: {
              goal: growthGoalResource,
              task: growthTaskResource,
              todo: growthTodoResource,
            },
          },
          skillRoots,
        },
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
