import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLUGIN_API_VERSION,
  definePluginManifest,
  parsePluginManifest,
  materializeMain,
  materializeRenderer,
  hrefFromLocation,
  hrefFromSnapshot,
  locationFromSearchParams,
  extensionPoints,
  valuesOf,
} from '../src/index.ts';

function growthManifest() {
  return definePluginManifest({
    pluginId: 'growth',
    version: '0.1.0',
    catalog: { nameKey: 'menu.growth' },
    contributions: {
      ipc: { todo: {}, trackTime: {} },
      views: { todo: { nameKey: 'menu.todo', order: 10 } },
      ai: {
        skills: { goalDecompose: { root: 'skills/goal-decompose' } },
        mcp: {
          tools: { searchGoals: { readOnly: true } },
          resources: { goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } } },
        },
      },
      activity: {
        captureTypes: { todo: {} },
        today: { todos: { kind: 'list', titleKey: 'today.todos' } },
      },
    },
  });
}

test('JSON round-trip defaults apiVersion to 0', () => {
  const json = JSON.parse(JSON.stringify(growthManifest()));
  const parsed = parsePluginManifest(json);
  assert.equal(parsed.apiVersion, PLUGIN_API_VERSION);
  assert.equal(parsed.apiVersion, 0);
  assert.equal(parsed.contributions.ipc?.todo !== undefined, true);
});

test('materializeMain reports missing and extra local keys', () => {
  const issues = materializeMain(growthManifest(), {
    ipc: { todo: { controller: {} } },
  }).issues;
  assert.equal(issues.some((issue) => issue.message.includes('trackTime')), true);
  assert.equal(issues.some((issue) => issue.message.includes('searchGoals')), true);
});

test('materializeMain namespaces ipc routes and mcp names', () => {
  const materialized = materializeMain(growthManifest(), {
    ipc: {
      todo: { controller: {} },
      trackTime: { controller: {} },
    },
    activity: {
      capture: { todo: { adopt: async () => ({ pluginId: 'growth', entityType: 'todo', entityId: '1' }) } },
      today: { todos: { collect: async () => ({ items: [] }) } },
    },
    ai: {
      mcp: {
        tools: {
          searchGoals: {
            description: '',
            parameters: {},
            schema: { parse: (value: unknown) => value },
            execute: async () => '',
          },
        },
        resources: { goal: { list: async () => [], read: async () => null } },
      },
      skillRoots: { goalDecompose: '/tmp/skills/goal-decompose' },
    },
  });
  assert.deepEqual(materialized.issues, []);
  const ipc = valuesOf(materialized.registrations, extensionPoints.ipc);
  const tools = valuesOf(materialized.registrations, extensionPoints.mcpTool);
  const captures = valuesOf(materialized.registrations, extensionPoints.capture);
  const mentions = valuesOf(materialized.registrations, extensionPoints.mention);
  const resources = valuesOf(materialized.registrations, extensionPoints.mcpResource);
  assert.equal(ipc.find((item) => item.id === 'growth:todo')?.routePrefix, '/growth/todo');
  assert.equal(tools[0]?.name, 'growth.searchGoals');
  assert.equal(captures[0]?.type, 'growth.todo');
  assert.equal(mentions[0]?.labelKey, 'menu.goal');
  assert.equal(mentions[0]?.provider, resources[0]?.provider);
  assert.equal(mentions.length, 1);
});

test('materializeRenderer reports missing views', () => {
  const issues = materializeRenderer(growthManifest(), { icon: undefined }).issues;
  assert.equal(issues.some((issue) => issue.message.includes('todo')), true);
});

test('materializeRenderer publishes plugin, views, locales, scopes and resource openers', () => {
  const Dummy = () => null;
  const materialized = materializeRenderer(growthManifest(), {
    icon: Dummy,
    locales: [{ pluginId: 'growth', messages: { zh_CN: { 'menu.goal': '目标' } } }],
    scope: Dummy,
    views: { todo: { load: async () => ({ default: Dummy }) } },
    openResource: (uri) => (uri.startsWith('tn://growth/') ? { viewId: 'growth.todo', params: {} } : null),
  });
  assert.deepEqual(materialized.issues, []);
  const views = valuesOf(materialized.registrations, extensionPoints.view);
  const locales = valuesOf(materialized.registrations, extensionPoints.locale);
  const scopes = valuesOf(materialized.registrations, extensionPoints.scope);
  const openers = valuesOf(materialized.registrations, extensionPoints.resourceOpener);
  const plugins = valuesOf(materialized.registrations, extensionPoints.plugin);
  assert.equal(plugins[0]?.pluginId, 'growth');
  assert.equal(views[0]?.id, 'growth.todo');
  assert.equal(locales[0]?.pluginId, 'growth');
  assert.equal(scopes[0]?.pluginId, 'growth');
  assert.deepEqual(openers[0]?.open('tn://growth/goals/g1'), { viewId: 'growth.todo', params: {} });
});

test('page location adapter round-trips opaque query params', () => {
  const location = locationFromSearchParams(new URLSearchParams('view=todo&tab=all'));
  assert.deepEqual(location, { view: 'todo', tab: 'all' });
  assert.equal(hrefFromLocation('growth', location), '/plugins/growth?view=todo&tab=all');
  assert.equal(
    hrefFromSnapshot('growth', { viewId: 'growth.todo', params: { tab: 'all' } }),
    '/plugins/growth?view=todo&tab=all',
  );
});

test('materializeRenderer registers a page root when page is declared and implemented', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const declared = definePluginManifest({
    pluginId: 'growth',
    version: '0.1.0',
    catalog: { nameKey: 'menu.growth' },
    contributions: {
      views: { todo: { nameKey: 'menu.todo' } },
      page: {},
    },
  });
  const materialized = materializeRenderer(declared, {
    views: { todo: { load } },
    page: { load },
  });
  assert.deepEqual(materialized.issues, []);
  const shells = valuesOf(materialized.registrations, extensionPoints.pageShell);
  assert.equal(shells[0]?.pluginId, 'growth');
  assert.equal(shells[0]?.load, load);
});

test('materializeRenderer reports missing and undeclared page implementations', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const missing = materializeRenderer(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: { page: {}, views: { todo: { nameKey: 'todo' } } },
    }),
    { views: { todo: { load } } },
  ).issues;
  assert.equal(missing.some((issue) => issue.message.includes('declared page')), true);

  const extra = materializeRenderer(
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: { views: { ledger: { nameKey: 'ledger' } } },
    }),
    { views: { ledger: { load } }, page: { load } },
  ).issues;
  assert.equal(extra.some((issue) => issue.message.includes('undeclared page')), true);
});

test('plugins without a page capability do not register a page root', () => {
  const Dummy = () => null;
  const materialized = materializeRenderer(
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: { views: { ledger: { nameKey: 'ledger' } } },
    }),
    { views: { ledger: { load: async () => ({ default: Dummy }) } } },
  );
  assert.deepEqual(materialized.issues, []);
  assert.equal(valuesOf(materialized.registrations, extensionPoints.pageShell).length, 0);
});
