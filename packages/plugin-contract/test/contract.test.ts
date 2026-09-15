import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLUGIN_API_VERSION,
  definePluginManifest,
  parsePluginManifest,
  validateManifests,
  mergeTodaySections,
  namespacedId,
  pluginPath,
  ipcRoute,
  mcpName,
  pluginResourceUri,
  parsePluginResourceUri,
  ACTIVITY_TODAY_INVALIDATE_EVENT,
} from '../src/index.ts';

test('round-trips a serializable manifest and defaults apiVersion to 0', () => {
  const manifest = definePluginManifest({
    pluginId: 'expense',
    version: '0.1.0',
    catalog: { nameKey: 'menu.expense' },
    contributions: {
      ipc: { expense: {} },
      views: { transaction: { nameKey: 'menu.expense.transaction', order: 10 } },
      activity: {
        captureTypes: { transaction: {} },
        today: { spent: { kind: 'metric', titleKey: 'plugins.hub.spent' } },
      },
    },
  });
  const json = JSON.parse(JSON.stringify(manifest));
  const parsed = parsePluginManifest(json);
  assert.equal(parsed.apiVersion, 0);
  assert.equal(PLUGIN_API_VERSION, 0);
  assert.deepEqual(parsed.pluginId, 'expense');
  assert.equal(pluginPath('expense'), '/plugins/expense');
  assert.equal(namespacedId('expense', 'transaction'), 'expense.transaction');
  assert.equal(ipcRoute('expense', 'expense'), '/expense/expense');
  assert.equal(parsed.contributions.views?.transaction?.nameKey, 'menu.expense.transaction');
});

test('rejects duplicate views across plugins', () => {
  const issues = validateManifests([
    definePluginManifest({
      pluginId: 'a',
      version: '1',
      catalog: { nameKey: 'a' },
      contributions: { views: { shared: { nameKey: 'shared' } } },
    }),
    definePluginManifest({
      pluginId: 'b',
      version: '1',
      catalog: { nameKey: 'b' },
      contributions: { views: { shared: { nameKey: 'other' } } },
    }),
  ]);
  assert.equal(issues.some((issue) => issue.code === 'duplicate-view'), false);
  const clash = validateManifests([
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'a' },
      contributions: { views: { todo: { nameKey: 'todo' } } },
    }),
    definePluginManifest({
      pluginId: 'growth-extra',
      version: '1',
      catalog: { nameKey: 'b' },
      contributions: { views: { todo: { nameKey: 'todo' } } },
    }),
  ]);
  assert.equal(clash.some((issue) => issue.code === 'duplicate-view'), false);
});

test('rejects duplicate ipc routes and mcp tools', () => {
  const issues = validateManifests([
    definePluginManifest({
      pluginId: 'a',
      version: '1',
      catalog: { nameKey: 'a' },
      contributions: {
        ipc: { one: {} },
        ai: { mcp: { tools: { shared: {} } } },
      },
    }),
    definePluginManifest({
      pluginId: 'b',
      version: '1',
      catalog: { nameKey: 'b' },
      contributions: {
        ipc: { one: {} },
        ai: { mcp: { tools: { shared: {} } } },
      },
    }),
  ]);
  const codes = new Set(issues.map((issue) => issue.code));
  assert.equal(codes.has('duplicate-controller'), false);
  assert.equal(ipcRoute('a', 'one') !== ipcRoute('b', 'one'), true);
  assert.equal(mcpName('a', 'shared') !== mcpName('b', 'shared'), true);
});

test('merges today sections by order', () => {
  const merged = mergeTodaySections([
    [{ id: 'growth.focus', kind: 'metric', titleKey: 'focus', order: 20, value: 10 }],
    [{ id: 'expense.spent', kind: 'metric', titleKey: 'spent', order: 10, value: 5 }],
  ]);
  assert.equal(merged[0]?.id, 'expense.spent');
  assert.equal(merged[1]?.value, 10);
});

test('today invalidate event is a stable activity channel', () => {
  assert.equal(ACTIVITY_TODAY_INVALIDATE_EVENT, 'activity.today.invalidate');
});

test('resource URIs stay opaque and round-trip local ids', () => {
  assert.equal(pluginResourceUri('growth', 'goals', 'g1'), 'tn://growth/goals/g1');
  assert.deepEqual(parsePluginResourceUri('tn://growth/goals/g1'), {
    pluginId: 'growth',
    collection: 'goals',
    id: 'g1',
  });
  assert.equal(parsePluginResourceUri('/plugins/growth?view=goal'), null);
});

test('mcp resource mention metadata is optional and parsed', () => {
  const parsed = parsePluginManifest(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        ai: {
          mcp: {
            resources: {
              goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } },
              archive: { uriTemplate: 'tn://growth/archives/{id}' },
            },
          },
        },
      },
    }),
  );
  assert.deepEqual(parsed.contributions.ai?.mcp?.resources?.goal?.mention, {
    labelKey: 'menu.goal',
    order: 10,
  });
  assert.equal(parsed.contributions.ai?.mcp?.resources?.archive?.mention, undefined);
});

test('optional empty page capability is accepted without layout fields', () => {
  const parsed = parsePluginManifest(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: { page: {} },
    }),
  );
  assert.deepEqual(parsed.contributions.page, {});
});
