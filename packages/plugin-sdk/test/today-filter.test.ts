import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isStandaloneTodayTodo,
  isTodayHabit,
} from '../../plugins/growth/src/main/today-filter.ts';

const today = '2026-09-14';

test('today habits include active due cycles and skip future or settled ones', () => {
  const due = { id: 'todo-due', status: 'todo', planDate: '2026-09-14', relatedType: 'habit' };
  const overdue = { id: 'todo-overdue', status: 'todo', planDate: '2026-09-13', relatedType: 'habit' };
  const future = { id: 'todo-future', status: 'todo', planDate: '2026-09-15', relatedType: 'habit' };
  const done = { id: 'todo-done', status: 'done', planDate: '2026-09-14', relatedType: 'habit' };

  assert.equal(
    isTodayHabit({ id: 'h1', name: 'due', status: 'active', cycleTodoId: 'todo-due' }, due, today),
    true,
  );
  assert.equal(
    isTodayHabit({ id: 'h2', name: 'overdue', status: 'active', cycleTodoId: 'todo-overdue' }, overdue, today),
    true,
  );
  assert.equal(
    isTodayHabit({ id: 'h3', name: 'future', status: 'active', cycleTodoId: 'todo-future' }, future, today),
    false,
  );
  assert.equal(
    isTodayHabit({ id: 'h4', name: 'done', status: 'active', cycleTodoId: 'todo-done' }, done, today),
    false,
  );
  assert.equal(
    isTodayHabit({ id: 'h5', name: 'paused', status: 'paused', cycleTodoId: 'todo-due' }, due, today),
    false,
  );
});

test('today todos exclude habit cycle items', () => {
  const standalone = { id: 'todo-1', status: 'todo', planDate: '2026-09-14', relatedType: 'none' };
  const habitCycle = { id: 'todo-h', status: 'todo', planDate: '2026-09-14', relatedType: 'habit' };
  const done = { id: 'todo-2', status: 'done', planDate: '2026-09-14', relatedType: 'none' };

  assert.equal(isStandaloneTodayTodo(standalone, today), true);
  assert.equal(isStandaloneTodayTodo(habitCycle, today), false);
  assert.equal(isStandaloneTodayTodo(done, today), false);
});
