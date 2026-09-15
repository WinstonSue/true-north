import dayjs from 'dayjs';
import { defineMainImplementation, namespacedId, type PluginMainContext } from '@true-north/plugin-sdk';
import { growthManifest } from '../plugin';
import { GoalController } from './service/goal/goal.route-controller';
import { HabitController } from './service/habit/habit.route-controller';
import { TaskController } from './service/task/task.route-controller';
import { TodoController } from './service/todo/todo.route-controller';
import { TrackTimeController } from './service/track-time/track-time.route-controller';
import { growthAiContribution } from './service/ai';
import { todoCaptureAdopter } from './service/todo/capture.adopter';
import { TodoFilterDto } from './service/todo/dto';
import { TodoRepository } from './service/todo/todo.repository';
import { HabitFilterDto } from './service/habit/dto';
import { HabitRepository } from './service/habit/habit.repository';
import { TrackTime } from './service/track-time/entity';
import { bindGrowthContext } from './context';
import { activateStorage, disposeStorage, store } from './storage';
import { createGrowthQuery } from './query';
import { isStandaloneTodayTodo, isTodayHabit, todayDate } from './today-filter';

function createTodaySections() {
  return [
    {
      id: namespacedId('growth', 'focus-timer'),
      async collect() {
        const todayDate = dayjs().format('YYYY-MM-DD');
        const focusRows = await store().getRepository(TrackTime).find();
        const running = focusRows.find((item) => item.startAt && !item.endAt);
        return {
          id: namespacedId('growth', 'focus-timer'),
          kind: 'timer' as const,
          titleKey: 'today.focus',
          order: 5,
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
    {
      id: namespacedId('growth', 'focus'),
      async collect() {
        const todayDate = dayjs().format('YYYY-MM-DD');
        const focusRows = await store().getRepository(TrackTime).find();
        const todayFocus = focusRows
          .filter((item) => item.startAt && dayjs(item.startAt).format('YYYY-MM-DD') === todayDate)
          .reduce((sum, item) => sum + (item.duration || 0), 0);
        return {
          id: namespacedId('growth', 'focus'),
          kind: 'metric' as const,
          titleKey: 'today.focus',
          order: 10,
          unit: 'seconds',
          value: todayFocus,
        };
      },
    },
    {
      id: namespacedId('growth', 'todos'),
      async collect() {
        const today = todayDate();
        const todos = await new TodoRepository().findByFilter(new TodoFilterDto());
        const dueTodos = todos.filter((todo) => isStandaloneTodayTodo(todo, today));
        return {
          id: namespacedId('growth', 'todos'),
          kind: 'list' as const,
          titleKey: 'menu.todo',
          order: 20,
          items: dueTodos.map((todo) => ({
            id: todo.id,
            label: todo.name,
            overdue: dayjs(todo.planDate).format('YYYY-MM-DD') < today,
            pluginId: 'growth',
            entityType: 'todo',
            actions: [
              {
                id: 'complete',
                labelKey: 'today.complete',
                command: { method: 'PUT' as const, path: `/todo/done/none/${todo.id}` },
              },
            ],
          })),
        };
      },
    },
    {
      id: namespacedId('growth', 'habits'),
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
          id: namespacedId('growth', 'habits'),
          kind: 'list' as const,
          titleKey: 'menu.habit',
          order: 30,
          items: todayHabits.map((habit) => {
            const cycleTodo = habit.cycleTodoId ? cycleById.get(habit.cycleTodoId) : undefined;
            return {
              id: habit.id,
              label: habit.name,
              overdue: cycleTodo ? dayjs(cycleTodo.planDate).format('YYYY-MM-DD') < today : false,
              pluginId: 'growth',
              entityType: 'habit',
              actions: [
                {
                  id: 'checkin',
                  labelKey: 'today.checkin',
                  disabled: !habit.cycleTodoId,
                  command: habit.cycleTodoId
                    ? { method: 'PUT' as const, path: `/todo/done/habit/${habit.cycleTodoId}` }
                    : undefined,
                },
              ],
            };
          }),
        };
      },
    },
  ];
}

export function createGrowthMain() {
  return defineMainImplementation(growthManifest, {
    async activate(ctx: PluginMainContext) {
      const runtime = await activateStorage(ctx.space);
      bindGrowthContext(ctx);
      return {
        ipcControllers: {
          goal: { controller: new GoalController() },
          task: { controller: new TaskController() },
          todo: { controller: new TodoController() },
          habit: { controller: new HabitController() },
          'track-time': { controller: new TrackTimeController() },
        },
        ai: growthAiContribution,
        query: createGrowthQuery(runtime),
        captureAdopters: [todoCaptureAdopter],
        todaySections: createTodaySections(),
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
