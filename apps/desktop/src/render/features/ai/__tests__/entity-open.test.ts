import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hrefFromSnapshot,
  parsePluginResourceUri,
  snapshotFromSearchParams,
} from '@true-north/plugin-sdk';

test('maps a resource snapshot to a plugin page href', () => {
  const snapshot = snapshotFromSearchParams(
    'growth',
    [{ id: 'growth.goal', order: 40 }],
    new URLSearchParams('view=goal&id=g1'),
  );
  assert.deepEqual(snapshot, { viewId: 'growth.goal', params: { id: 'g1' } });
  assert.equal(hrefFromSnapshot('growth', snapshot), '/plugins/growth?view=goal&id=g1');
});

test('growth and expense page adapters keep local view ids', () => {
  const growthViews = [
    { id: 'growth.todo', order: 10, default: true },
    { id: 'growth.task', order: 20 },
    { id: 'growth.habit', order: 30 },
    { id: 'growth.goal', order: 40 },
  ];
  assert.equal(snapshotFromSearchParams('growth', growthViews, new URLSearchParams()).viewId, 'growth.todo');
  assert.equal(snapshotFromSearchParams('growth', growthViews, new URLSearchParams('view=habit&id=h1')).viewId, 'growth.habit');
  assert.equal(
    hrefFromSnapshot('growth', { viewId: 'growth.task', params: { tab: 'all' } }),
    '/plugins/growth?view=task&tab=all',
  );

  const expenseViews = [
    { id: 'expense.transaction', order: 10, default: true },
    { id: 'expense.budget', order: 20 },
    { id: 'expense.overview', order: 30 },
  ];
  assert.equal(snapshotFromSearchParams('expense', expenseViews, new URLSearchParams('view=budget')).viewId, 'expense.budget');
  assert.equal(
    hrefFromSnapshot('expense', { viewId: 'expense.overview', params: {} }),
    '/plugins/expense?view=overview',
  );
});

test('resource URIs map to the same view request the page adapter uses', () => {
  const parsed = parsePluginResourceUri('tn://growth/goals/g1');
  assert.deepEqual(parsed, { pluginId: 'growth', collection: 'goals', id: 'g1' });
  const request = { viewId: 'growth.goal', params: { tab: 'tree', id: parsed?.id || '' } };
  assert.equal(hrefFromSnapshot('growth', request), '/plugins/growth?view=goal&tab=tree&id=g1');
});

