import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hrefFromLocation,
  hrefFromSnapshot,
  locationFromSearchParams,
  parsePluginResourceUri,
} from '@true-north/plugin-sdk';

test('maps a resource location to a plugin page href', () => {
  const location = locationFromSearchParams(new URLSearchParams('view=goal&id=g1'));
  assert.deepEqual(location, { view: 'goal', id: 'g1' });
  assert.equal(hrefFromLocation('growth', location), '/plugins/growth?view=goal&id=g1');
});

test('plugin page adapter keeps opaque query keys', () => {
  assert.deepEqual(locationFromSearchParams(new URLSearchParams()), {});
  assert.deepEqual(locationFromSearchParams(new URLSearchParams('view=habit&id=h1')), {
    view: 'habit',
    id: 'h1',
  });
  assert.equal(
    hrefFromSnapshot('growth', { viewId: 'growth.task', params: { tab: 'all' } }),
    '/plugins/growth?view=task&tab=all',
  );
  assert.equal(
    hrefFromLocation('expense', { view: 'budget' }),
    '/plugins/expense?view=budget',
  );
  assert.equal(hrefFromLocation('expense', { view: 'overview' }), '/plugins/expense?view=overview');
});

test('resource URIs map to a workbench view request and a page location', () => {
  const parsed = parsePluginResourceUri('tn://growth/goals/g1');
  assert.deepEqual(parsed, { pluginId: 'growth', collection: 'goals', id: 'g1' });
  const request = { viewId: 'growth.goal', params: { view: 'goal', tab: 'tree', id: parsed?.id || '' } };
  assert.equal(hrefFromSnapshot('growth', request), '/plugins/growth?view=goal&tab=tree&id=g1');
});
