import assert from 'node:assert/strict';
import test from 'node:test';
import { pluginViewInputFromEntity } from '../entity-source.ts';

test('maps a known entity type to a workbench view input', () => {
  const input = pluginViewInputFromEntity(
    [
      { type: 'goal', workbenchViewId: 'growth.goal' },
      { type: 'task', workbenchViewId: 'growth.task' },
    ],
    'goal',
    'g1',
  );
  assert.deepEqual(input, {
    viewId: 'growth.goal',
    target: { type: 'goal', id: 'g1' },
  });
});

test('returns null when the entity type has no workbench view', () => {
  assert.equal(pluginViewInputFromEntity([{ type: 'task', workbenchViewId: 'growth.task' }], 'goal', 'g1'), null);
  assert.equal(pluginViewInputFromEntity([], 'task', 't1'), null);
});
