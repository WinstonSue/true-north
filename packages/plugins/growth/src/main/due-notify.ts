import { store } from './storage';
import { Todo } from './service/todo/todo.entity';
import { Task } from './service/task/task.entity';
import { Habit } from './service/habit/habit.entity';
import { GrowthNotifyFire } from './notify-settings.entity';
import { getGrowthNotifySettings } from './notify-settings.service';
import { habitSlots, mergeRule, passedSlots, taskSlots, todoSlots } from './notify-slots';
import { trackGrowthResource } from './context';

async function alreadyFired(kind: string, entityId: string, slotDate: string, slotHm: string) {
  const repo = store().getRepository(GrowthNotifyFire);
  const row = await repo.findOneBy({ kind, entityId, slotDate, slotHm });
  return Boolean(row);
}

async function markFired(kind: string, entityId: string, slotDate: string, slotHm: string) {
  const repo = store().getRepository(GrowthNotifyFire);
  const existing = await repo.findOneBy({ kind, entityId, slotDate, slotHm });
  if (existing) return;
  await repo.save(repo.create({ kind, entityId, slotDate, slotHm }));
}

async function fireSlots(
  kind: 'todo' | 'task' | 'habit',
  entityId: string,
  title: string,
  slots: { date: string; hm: string }[],
  now: Date,
) {
  for (const slot of passedSlots(slots, now)) {
    if (await alreadyFired(kind, entityId, slot.date, slot.hm)) continue;
    await trackGrowthResource({ title, entityType: kind, entityId });
    await markFired(kind, entityId, slot.date, slot.hm);
  }
}

export async function syncGrowthDueNotifications(now = new Date()) {
  let runtime;
  try {
    runtime = store();
  } catch {
    return;
  }
  const settings = await getGrowthNotifySettings();
  const todos = (await runtime.getRepository(Todo).find()) as Todo[];
  const tasks = (await runtime.getRepository(Task).find()) as Task[];
  const habits = (await runtime.getRepository(Habit).find()) as Habit[];
  const todosById = new Map(todos.map((todo) => [todo.id, todo]));

  for (const todo of todos) {
    await fireSlots(
      'todo',
      todo.id,
      todo.name,
      todoSlots({
        now,
        todo,
        rule: mergeRule(settings.todo, todo.notifyRule),
      }),
      now,
    );
  }

  for (const task of tasks) {
    await fireSlots(
      'task',
      task.id,
      task.name,
      taskSlots({
        now,
        task,
        rule: mergeRule(settings.task, task.notifyRule),
      }),
      now,
    );
  }

  for (const habit of habits) {
    const cycleTodo = habit.cycleTodoId ? todosById.get(habit.cycleTodoId) : undefined;
    await fireSlots(
      'habit',
      habit.id,
      habit.name,
      habitSlots({
        now,
        habit,
        cycleTodo,
        rule: mergeRule(settings.habit, habit.notifyRule),
      }),
      now,
    );
  }
}
