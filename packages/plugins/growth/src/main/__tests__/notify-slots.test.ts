import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_GROWTH_NOTIFY_SETTINGS } from '../notify-slots.ts';
import { habitSlots, mergeRule, passedSlots, taskSlots, todoSlots } from '../notify-slots.ts';

const now = new Date('2026-09-16T21:30:00');

test('empty item rule inherits the global default', () => {
  const merged = mergeRule(DEFAULT_GROWTH_NOTIFY_SETTINGS.todo, null);
  assert.deepEqual(merged, DEFAULT_GROWTH_NOTIFY_SETTINGS.todo);
});

test('overdue todos fire morning and evening slots that have passed', () => {
  const slots = passedSlots(
    todoSlots({
      now,
      todo: { status: 'todo', planDate: '2026-09-15', relatedType: 'none' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.todo,
    }),
    now,
  );
  assert.deepEqual(slots, [
    { date: '2026-09-16', hm: '08:00' },
    { date: '2026-09-16', hm: '21:00' },
  ]);
});

test('today todos without a start time use 08:00 and 21:00', () => {
  const slots = passedSlots(
    todoSlots({
      now,
      todo: { status: 'todo', planDate: '2026-09-16', relatedType: 'none' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.todo,
    }),
    now,
  );
  assert.deepEqual(slots, [
    { date: '2026-09-16', hm: '08:00' },
    { date: '2026-09-16', hm: '21:00' },
  ]);
});

test('overdue tasks fire 21:00 after an 20:00 end, and 08:00 after a 07:00 end', () => {
  const evening = passedSlots(
    taskSlots({
      now,
      task: { status: 'doing', startAt: '2026-09-16 09:00', endAt: '2026-09-16 20:00' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.task,
    }),
    now,
  );
  assert.deepEqual(evening, [{ date: '2026-09-16', hm: '21:00' }]);

  const morning = passedSlots(
    taskSlots({
      now: new Date('2026-09-16T08:30:00'),
      task: { status: 'todo', startAt: '2026-09-15 09:00', endAt: '2026-09-16 07:00' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.task,
    }),
    new Date('2026-09-16T08:30:00'),
  );
  assert.deepEqual(morning, [{ date: '2026-09-16', hm: '08:00' }]);
});

test('habits only fire 21:00 on the cycle date and skip overdue cycles', () => {
  const today = passedSlots(
    habitSlots({
      now,
      habit: { status: 'active', cycleTodoId: 'c1' },
      cycleTodo: { status: 'todo', planDate: '2026-09-16' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.habit,
    }),
    now,
  );
  assert.deepEqual(today, [{ date: '2026-09-16', hm: '21:00' }]);
  assert.deepEqual(
    habitSlots({
      now,
      habit: { status: 'active', cycleTodoId: 'c1' },
      cycleTodo: { status: 'todo', planDate: '2026-09-15' },
      rule: DEFAULT_GROWTH_NOTIFY_SETTINGS.habit,
    }),
    [],
  );
});
