import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ExtensionRegistry,
  defineExtensionPoint,
  extensionPoints,
  valuesOf,
} from '../src/index.ts';

const numbers = defineExtensionPoint<number>('test.number');
const labels = defineExtensionPoint<string>('test.label');

test('registerBatch is atomic and fails on duplicate keys', () => {
  const registry = new ExtensionRegistry();
  registry.register('a', numbers, 'one', 1, 20);
  assert.throws(
    () =>
      registry.registerBatch('b', [
        { point: numbers, key: 'two', value: 2 },
        { point: numbers, key: 'one', value: 9 },
      ]),
    /重复注册扩展/,
  );
  assert.deepEqual(registry.list(numbers), [1]);
  assert.equal(registry.get(numbers, 'two'), undefined);
});

test('list is stable by order then key, and unregisterOwner clears one plugin', () => {
  const registry = new ExtensionRegistry();
  registry.registerBatch('growth', [
    { point: labels, key: 'goal', value: '目标', order: 20 },
    { point: numbers, key: 'n', value: 3 },
  ]);
  registry.registerBatch('expense', [{ point: labels, key: 'spent', value: '支出', order: 10 }]);
  assert.deepEqual(registry.list(labels), ['支出', '目标']);
  let ticks = 0;
  const stop = registry.subscribe(() => {
    ticks += 1;
  });
  registry.unregisterOwner('growth');
  assert.deepEqual(registry.list(labels), ['支出']);
  assert.equal(registry.get(numbers, 'n'), undefined);
  assert.equal(ticks, 1);
  stop();
  registry.unregisterOwner('expense');
  assert.equal(ticks, 1);
});

test('valuesOf reads materialized registrations in order', () => {
  const rows = valuesOf(
    [
      { point: extensionPoints.mcpTool, key: 'growth.searchGoals', order: 2, value: { name: 'growth.searchGoals' } as never },
      { point: extensionPoints.ipc, key: 'growth:todo', value: { id: 'growth:todo' } as never },
      { point: extensionPoints.mcpTool, key: 'growth.getGoal', order: 1, value: { name: 'growth.getGoal' } as never },
    ],
    extensionPoints.mcpTool,
  );
  assert.deepEqual(rows.map((item) => item.name), ['growth.getGoal', 'growth.searchGoals']);
});
