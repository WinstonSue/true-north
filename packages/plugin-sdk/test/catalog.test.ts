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
  hrefFromOpenRequest,
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
      resources: { goal: { uriTemplate: 'tn://growth/goals/{id}', mention: { labelKey: 'menu.goal', order: 10 } } },
      workbench: { newTabs: { capture: { nameKey: 'menu.todo', order: 10 } } },
      ai: {
        skills: { goalDecompose: { root: 'skills/goal-decompose' } },
        mcp: {
          tools: { searchGoals: { readOnly: true } },
        },
      },
      workflow: {
        commands: { createTodo: { inputSchema: { type: 'object' } } },
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
    workflow: {
      commands: {
        createTodo: {
          execute: async () => ({ status: 'applied' as const, resource: { uri: 'tn://growth/todos/1', revision: '1' } }),
        },
      },
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
      },
      skillRoots: { goalDecompose: '/tmp/skills/goal-decompose' },
    },
    resources: { goal: { list: async () => [], read: async () => null } },
  });
  assert.deepEqual(materialized.issues, []);
  const ipc = valuesOf(materialized.registrations, extensionPoints.ipc);
  const tools = valuesOf(materialized.registrations, extensionPoints.mcpTool);
  const commands = valuesOf(materialized.registrations, extensionPoints.workflowCommand);
  const mentions = valuesOf(materialized.registrations, extensionPoints.mention);
  const resources = valuesOf(materialized.registrations, extensionPoints.mcpResource);
  assert.equal(ipc.find((item) => item.id === 'growth:todo')?.routePrefix, '/growth/todo');
  assert.equal(tools[0]?.name, 'growth.searchGoals');
  assert.equal(commands[0]?.id, 'growth.createTodo');
  assert.equal(mentions[0]?.labelKey, 'menu.goal');
  assert.equal(mentions[0]?.provider, resources[0]?.provider);
  assert.equal(mentions.length, 1);
});

test('materializeRenderer reports missing newTabs', () => {
  const issues = materializeRenderer(growthManifest(), { icon: undefined }).issues;
  assert.equal(issues.some((issue) => issue.message.includes('capture')), true);
});

test('materializeRenderer publishes plugin, locales, scopes and resource openers', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const materialized = materializeRenderer(growthManifest(), {
    icon: Dummy,
    locales: [{ pluginId: 'growth', messages: { zh_CN: { 'menu.goal': '目标' } } }],
    scope: Dummy,
    workbench: { newTabs: { capture: { load } } },
    openResource: (uri) =>
      uri.startsWith('tn://growth/') ? { pluginId: 'growth', location: { view: 'todo' } } : null,
  });
  assert.deepEqual(materialized.issues, []);
  const locales = valuesOf(materialized.registrations, extensionPoints.locale);
  const scopes = valuesOf(materialized.registrations, extensionPoints.scope);
  const openers = valuesOf(materialized.registrations, extensionPoints.resourceOpener);
  const plugins = valuesOf(materialized.registrations, extensionPoints.plugin);
  assert.equal(plugins[0]?.pluginId, 'growth');
  assert.equal(locales[0]?.pluginId, 'growth');
  assert.equal(scopes[0]?.pluginId, 'growth');
  assert.deepEqual(openers[0]?.open('tn://growth/goals/g1'), { pluginId: 'growth', location: { view: 'todo' } });
  const newTabs = valuesOf(materialized.registrations, extensionPoints.newTab);
  assert.equal(newTabs[0]?.id, 'growth.capture');
  assert.equal(newTabs[0]?.nameKey, 'menu.todo');
  assert.equal(newTabs[0]?.load, load);
});

test('page location adapter round-trips opaque query params', () => {
  const location = locationFromSearchParams(new URLSearchParams('view=todo&tab=all'));
  assert.deepEqual(location, { view: 'todo', tab: 'all' });
  assert.equal(hrefFromLocation('growth', location), '/plugins/growth?view=todo&tab=all');
  assert.equal(
    hrefFromOpenRequest({ pluginId: 'growth', location: { view: 'todo', tab: 'all' } }),
    '/plugins/growth?view=todo&tab=all',
  );
  assert.equal(
    hrefFromSnapshot('growth', { viewId: 'growth.todo', params: { tab: 'all' } }),
    '/plugins/growth?view=todo&tab=all',
  );
});

test('materializeRenderer registers a hub root when hub is declared and implemented', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const declared = definePluginManifest({
    pluginId: 'growth',
    version: '0.1.0',
    catalog: { nameKey: 'menu.growth' },
    contributions: {
      hub: {},
    },
  });
  const materialized = materializeRenderer(declared, {
    hub: { load },
  });
  assert.deepEqual(materialized.issues, []);
  const shells = valuesOf(materialized.registrations, extensionPoints.hub);
  assert.equal(shells[0]?.pluginId, 'growth');
  assert.equal(shells[0]?.load, load);
});

test('materializeRenderer reports missing and undeclared hub implementations', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const missing = materializeRenderer(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: { hub: {} },
    }),
    { },
  ).issues;
  assert.equal(missing.some((issue) => issue.message.includes('declared hub')), true);

  const extra = materializeRenderer(
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: {},
    }),
    { hub: { load } },
  ).issues;
  assert.equal(extra.some((issue) => issue.message.includes('undeclared hub')), true);
});

test('plugins without a hub capability do not register a hub root', () => {
  const Dummy = () => null;
  const materialized = materializeRenderer(
    definePluginManifest({
      pluginId: 'expense',
      version: '1',
      catalog: { nameKey: 'expense' },
      contributions: {},
    }),
    {},
  );
  assert.deepEqual(materialized.issues, []);
  assert.equal(valuesOf(materialized.registrations, extensionPoints.hub).length, 0);
});

test('materializeRenderer registers only declared newTabs with their own load', () => {
  const Dummy = () => null;
  const load = async () => ({ default: Dummy });
  const materialized = materializeRenderer(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        workbench: { newTabs: { capture: { nameKey: 'menu.todo', order: 10 } } },
      },
    }),
    { workbench: { newTabs: { capture: { load } } } },
  );
  assert.deepEqual(materialized.issues, []);
  const newTabs = valuesOf(materialized.registrations, extensionPoints.newTab);
  assert.equal(newTabs.length, 1);
  assert.equal(newTabs[0]?.id, 'growth.capture');
  assert.equal(newTabs[0]?.nameKey, 'menu.todo');
  assert.equal(newTabs[0]?.load, load);
});

test('materializeRenderer reports newTab keys that are not implemented', () => {
  const issues = materializeRenderer(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        workbench: { newTabs: { missing: { nameKey: 'missing', order: 10 } } },
      },
    }),
    {},
  ).issues;
  assert.equal(issues.some((issue) => issue.message.includes('missing')), true);
});

test('materializeMain reports missing workflow commands', () => {
  const issues = materializeMain(
    definePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
      contributions: {
        workflow: { commands: { createTodo: { inputSchema: { type: 'object' } } } },
      },
    }),
    { workflow: { commands: {} } },
  ).issues;
  assert.equal(issues.some((issue) => issue.message.includes('workflow command')), true);
});

test('materializeMain reports undeclared workflow commands', () => {
  const issues = materializeMain(
    parsePluginManifest({
      pluginId: 'growth',
      version: '1',
      catalog: { nameKey: 'growth' },
    }),
    {
      workflow: {
        commands: {
          extra: {
            execute: async () => ({ status: 'applied' as const }),
          },
        },
      },
    },
  ).issues;
  assert.equal(issues.some((issue) => issue.message.includes('undeclared') && issue.message.includes('extra')), true);
});

test('materializeRenderer registers declared workflow interactions', () => {
  const Dummy = () => null;
  const materialized = materializeRenderer(
    definePluginManifest({
      pluginId: 'demo',
      version: '1',
      catalog: { nameKey: 'demo' },
      contributions: {
        hub: {},
        workflow: {
          commands: { complete: { inputSchema: { type: 'object' } } },
          interactions: { confirm: { producesCommand: 'complete' } },
        },
      },
    }),
    {
      hub: { load: async () => ({ default: Dummy }) },
      workflow: { interactions: { confirm: { load: async () => ({ default: Dummy }) } } },
    },
  );
  assert.deepEqual(materialized.issues, []);
  const interactions = valuesOf(materialized.registrations, extensionPoints.workflowInteraction);
  assert.equal(interactions[0]?.id, 'demo.confirm');
  assert.equal(interactions[0]?.producesCommand, 'complete');
});
