import assert from 'node:assert/strict';
import test from 'node:test';
import {
  goalViewCodec,
  habitViewCodec,
  taskViewCodec,
  todoViewCodec,
} from '../view-state.ts';
import { growthViewDefinitions } from '../view-definitions.ts';

test('todo codec omits the default tab', () => {
  assert.deepEqual(todoViewCodec.decode({}), { tab: growthViewDefinitions.todo.defaultTab });
  assert.deepEqual(todoViewCodec.encode({ tab: 'today' }), {});
  assert.deepEqual(todoViewCodec.encode({ tab: 'calendar' }), { tab: 'calendar' });
  assert.equal(todoViewCodec.decode({ tab: 'unknown' }).tab, 'today');
});

test('task codec keeps id without inventing a tab', () => {
  assert.deepEqual(taskViewCodec.decode({ id: 't1' }), { tab: 'today', id: 't1' });
  assert.deepEqual(taskViewCodec.encode({ tab: 'today', id: 't1' }), { id: 't1' });
});

test('habit detail is route-only and encodes tab=detail', () => {
  assert.deepEqual(habitViewCodec.decode({ id: 'h1' }), { tab: 'detail', id: 'h1' });
  assert.deepEqual(habitViewCodec.encode({ tab: 'detail', id: 'h1' }), { tab: 'detail', id: 'h1' });
  assert.deepEqual(habitViewCodec.encode({ tab: 'list' }), {});
});

test('goal codec omits the default tree tab', () => {
  assert.deepEqual(goalViewCodec.decode({}), { tab: 'tree', id: undefined });
  assert.deepEqual(goalViewCodec.encode({ tab: 'tree' }), {});
  assert.deepEqual(goalViewCodec.encode({ tab: 'mindmap', id: 'g1' }), { tab: 'mindmap', id: 'g1' });
});
