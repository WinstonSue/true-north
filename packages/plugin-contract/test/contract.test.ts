import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLUGIN_API_VERSION,
  definePluginManifest,
  parsePluginManifest,
  validateManifests,
  namespacedId,
  pluginPath,
  ipcRoute,
  mcpName,
  pluginResourceUri,
  parsePluginResourceUri,
  commandResultSchema,
} from '../src/index.ts';

test('round-trips a serializable manifest and defaults apiVersion to 0', () => {
  const manifest = definePluginManifest({
    pluginId: 'expense',
    version: '0.1.0',
    catalog: { nameKey: 'menu.expense' },
    contributions: {
      ipc: { expense: {} },
      views: { transaction: { nameKey: 'menu.expense.transaction' } },
      workbench: { newTabs: { transaction: { order: 10 } } },
      workflow: {
        events: { booked: { payloadSchema: { type: 'object' } } },
        commands: {
          createTransaction: {
            inputSchema: { type: 'object' },
            idempotent: true,
          },
        },
      },
      hub: {},
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
  assert.equal('order' in (parsed.contributions.views?.transaction || {}), false);
  assert.deepEqual(parsed.contributions.workbench?.newTabs?.transaction, { order: 10 });
  assert.equal(parsed.contributions.workflow?.commands?.createTransaction?.idempotent, true);
  assert.deepEqual(parsed.contributions.hub, {});
});

test('newTab may omit nameKey and inherit it at materialize time', () => {
  const parsed = parsePluginManifest(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        views: { todo: { nameKey: 'menu.todo' } },
        workbench: { newTabs: { todo: {} } },
      },
    }),
  );
  assert.deepEqual(parsed.contributions.workbench?.newTabs?.todo, {});
  assert.equal(parsed.contributions.workbench?.newTabs?.todo?.nameKey, undefined);
});

test('rejects unknown interaction command and compensate targets', () => {
  const issues = validateManifests([
    definePluginManifest({
      pluginId: 'demo',
      version: '1',
      catalog: { nameKey: 'demo' },
      contributions: {
        workflow: {
          commands: { create: { inputSchema: { type: 'object' } } },
          interactions: { confirm: { producesCommand: 'missing' } },
        },
      },
    }),
  ]);
  assert.equal(
    issues.some((issue) => issue.message.includes('produces unknown command')),
    true,
  );

  const compensate = validateManifests([
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: {
        workflow: {
          commands: {
            book: { inputSchema: { type: 'object' }, compensate: 'undo' },
          },
        },
      },
    }),
  ]);
  assert.equal(
    compensate.some((issue) => issue.message.includes('compensate "undo" is not declared')),
    true,
  );
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

test('command result union is JSON-safe', () => {
  const applied = commandResultSchema.parse({
    status: 'applied',
    resource: { uri: 'tn://growth/todos/1', revision: '2' },
  });
  assert.equal(applied.status, 'applied');
  const conflict = commandResultSchema.parse({
    status: 'conflict',
    expectedRevision: '1',
    actualRevision: '3',
    reason: 'revision mismatch',
  });
  assert.equal(conflict.status, 'conflict');
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

test('optional empty hub capability is accepted without layout fields', () => {
  const parsed = parsePluginManifest(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: { hub: {} },
    }),
  );
  assert.deepEqual(parsed.contributions.hub, {});
});
