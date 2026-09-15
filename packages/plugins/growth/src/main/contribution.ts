import dayjs from 'dayjs';
import { defineMainImplementation, pluginResourceUri, type PluginMainContext } from '@true-north/plugin-sdk';
import { resolvePluginPackageRoot, resolveSkillRoots } from '@true-north/plugin-sdk/main';
import { growthManifest } from '../manifest';
import { GoalController } from './service/goal/goal.route-controller';
import { HabitController } from './service/habit/habit.route-controller';
import { TaskController } from './service/task/task.route-controller';
import { TodoController } from './service/todo/todo.route-controller';
import { TrackTimeController } from './service/track-time/track-time.route-controller';
import { growthMcpTools } from './service/ai/tools';
import { growthGoalResource, growthTaskResource } from './service/ai/resources';
import { todoCaptureAdopter } from './service/todo/capture.adopter';
import { TodoFilterDto } from './service/todo/dto';
import { TodoRepository } from './service/todo/todo.repository';
import { HabitFilterDto } from './service/habit/dto';
import { HabitRepository } from './service/habit/habit.repository';
import { TrackTime } from './service/track-time/entity';
import { bindGrowthContext } from './context';
import { activateStorage, disposeStorage, store } from './storage';
import { isStandaloneTodayTodo, isTodayHabit, todayDate } from './today-filter';

const skillRoots = resolveSkillRoots(
  resolvePluginPackageRoot('@true-north/plugin-growth', import.meta.url),
  growthManifest.contributions.ai?.skills,
);

function createTodaySections() {
  return {
    focusTimer: {
      async collect() {
        const focusRows = await store().getRepository(TrackTime).find();
        const running = focusRows.find((item) => item.startAt && !item.endAt);
        return {
          timer: running
            ? {
                id: running.id,
                label: running.notes || '专注中',
                startedAt: running.startAt instanceof Date ? running.startAt.toISOString() : String(running.startAt),
                hostAction: 'growth.open-focus',
              }
            : undefined,
        };
      },
    },
    focus: {
      async collect() {
        const today = dayjs().format('YYYY-MM-DD');
        const focusRows = await store().getRepository(TrackTime).find();
        const todayFocus = focusRows
          .filter((item) => item.startAt && dayjs(item.startAt).format('YYYY-MM-DD') === today)
          .reduce((sum, item) => sum + (item.duration || 0), 0);
        return { value: todayFocus };
      },
    },
    todos: {
      async collect() {
        const today = todayDate();
        const todos = await new TodoRepository().findByFilter(new TodoFilterDto());
        const dueTodos = todos.filter((todo) => isStandaloneTodayTodo(todo, today));
        return {
          items: dueTodos.map((todo) => ({
            id: todo.id,
            label: todo.name,
            overdue: dayjs(todo.planDate).format('YYYY-MM-DD') < today,
            pluginId: 'growth',
            uri: pluginResourceUri('growth', 'todos', todo.id),
            actions: [
              {
                id: 'complete',
                labelKey: 'today.complete',
                command: { method: 'PUT' as const, path: `/growth/todo/done/none/${todo.id}` },
              },
            ],
          })),
        };
      },
    },
    habits: {
      async collect() {
        const today = todayDate();
        const habits = await new HabitRepository().findByFilter(new HabitFilterDto());
        const cycleIds = habits.map((habit) => habit.cycleTodoId).filter((id): id is string => Boolean(id));
        const cycleFilter = new TodoFilterDto();
        cycleFilter.includeIds = cycleIds;
        const cycleTodos = cycleIds.length ? await new TodoRepository().findByFilter(cycleFilter) : [];
        const cycleById = new Map(cycleTodos.map((todo) => [todo.id, todo]));
        const todayHabits = habits.filter((habit) =>
          isTodayHabit(habit, habit.cycleTodoId ? cycleById.get(habit.cycleTodoId) : undefined, today),
        );
        return {
          items: todayHabits.map((habit) => {
            const cycleTodo = habit.cycleTodoId ? cycleById.get(habit.cycleTodoId) : undefined;
            return {
              id: habit.id,
              label: habit.name,
              overdue: cycleTodo ? dayjs(cycleTodo.planDate).format('YYYY-MM-DD') < today : false,
              pluginId: 'growth',
              uri: pluginResourceUri('growth', 'habits', habit.id),
              actions: [
                {
                  id: 'checkin',
                  labelKey: 'today.checkin',
                  disabled: !habit.cycleTodoId,
                  command: habit.cycleTodoId
                    ? { method: 'PUT' as const, path: `/growth/todo/done/habit/${habit.cycleTodoId}` }
                    : undefined,
                },
              ],
            };
          }),
        };
      },
    },
  };
}

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
        activity: {
          capture: { todo: { adopt: (suggestion) => todoCaptureAdopter.adopt(suggestion) } },
          today: createTodaySections(),
        },
        ai: {
          mcp: {
            tools: growthMcpTools,
            resources: {
              goal: growthGoalResource,
              task: growthTaskResource,
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
