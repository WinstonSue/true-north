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
      resources: { transaction: { uriTemplate: 'tn://expense/transactions/{id}' } },
      workbench: { newTabs: { capture: { nameKey: 'menu.expense.transaction', order: 10 } } },
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
  assert.equal(parsed.contributions.resources?.transaction?.uriTemplate, 'tn://expense/transactions/{id}');
  assert.deepEqual(parsed.contributions.workbench?.newTabs?.capture, {
    nameKey: 'menu.expense.transaction',
    order: 10,
  });
  assert.equal(parsed.contributions.workflow?.commands?.createTransaction?.idempotent, true);
  assert.deepEqual(parsed.contributions.hub, {});
});

test('newTab requires nameKey', () => {
  const parsed = parsePluginManifest(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        workbench: { newTabs: { capture: { nameKey: 'menu.todo' } } },
      },
    }),
  );
  assert.equal(parsed.contributions.workbench?.newTabs?.capture?.nameKey, 'menu.todo');
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

test('rejects duplicate resource URIs across plugins', () => {
  const issues = validateManifests([
    definePluginManifest({
      pluginId: 'a',
      version: '1',
      catalog: { nameKey: 'a' },
      contributions: { resources: { shared: { uriTemplate: 'tn://a/items/{id}' } } },
    }),
    definePluginManifest({
      pluginId: 'b',
      version: '1',
      catalog: { nameKey: 'b' },
      contributions: { resources: { other: { uriTemplate: 'tn://a/items/{id}' } } },
    }),
  ]);
  assert.equal(issues.some((issue) => issue.code === 'duplicate-resource'), true);
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
        resources: {
          goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } },
          archive: { uriTemplate: 'tn://growth/archives/{id}' },
        },
      },
    }),
  );
  assert.deepEqual(parsed.contributions.resources?.goal?.mention, {
    labelKey: 'menu.goal',
    order: 10,
  });
  assert.equal(parsed.contributions.resources?.archive?.mention, undefined);
});

test('rejects cyclic workflow templates and unknown local compensate', () => {
  const issues = validateManifests([
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: {
        workflow: {
          commands: {
            createTransaction: { inputSchema: { type: 'object' }, compensate: 'deleteTransaction' },
            deleteTransaction: { inputSchema: { type: 'object' } },
          },
          templates: {
            loop: {
              nameKey: 'loop',
              graph: {
                schemaVersion: 1,
                start: { eventContributionId: 'growth.todoCompleted' },
                nodes: [
                  { key: 'a', kind: 'command', contributionId: 'expense.createTransaction' },
                  { key: 'b', kind: 'command', contributionId: 'expense.deleteTransaction' },
                ],
                edges: [
                  { key: 'e1', from: 'a', to: 'b' },
                  { key: 'e2', from: 'b', to: 'a' },
                ],
                bindings: [],
                rollbackPolicy: 'confirmThenCompensate',
              },
            },
          },
        },
      },
    }),
  ]);
  assert.equal(
    issues.some((issue) => issue.message.includes('cycle')),
    true,
  );
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
