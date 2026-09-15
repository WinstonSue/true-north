import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLUGIN_API_VERSION,
  definePluginManifest,
  parsePluginManifest,
  materializeMain,
  materializeRenderer,
  hrefFromSnapshot,
  snapshotFromSearchParams,
} from '../src/index.ts';

function growthManifest() {
  return definePluginManifest({
    pluginId: 'growth',
    version: '0.1.0',
    catalog: { nameKey: 'menu.growth' },
    contributions: {
      ipc: { todo: {}, trackTime: {} },
      views: { todo: { nameKey: 'menu.todo', order: 10, default: true } },
      ai: {
        skills: { goalDecompose: { root: 'skills/goal-decompose' } },
        mcp: {
          tools: { searchGoals: { readOnly: true } },
          resources: { goal: { uriTemplate: 'tn://growth/goals/{id}' } },
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
  assert.equal(materialized.ipc.find((item) => item.id === 'growth:todo')?.routePrefix, '/growth/todo');
  assert.equal(materialized.tools[0]?.name, 'growth.searchGoals');
  assert.equal(materialized.captureAdopters[0]?.type, 'growth.todo');
});

test('materializeRenderer reports missing views', () => {
  const issues = materializeRenderer(growthManifest(), { icon: undefined }).issues;
  assert.equal(issues.some((issue) => issue.message.includes('todo')), true);
});

test('page snapshot adapter uses local view ids', () => {
  const snapshot = snapshotFromSearchParams(
    'growth',
    [{ id: 'growth.todo', default: true, order: 10 }],
    new URLSearchParams('view=todo&tab=all'),
  );
  assert.equal(snapshot.viewId, 'growth.todo');
  assert.equal(snapshot.params.tab, 'all');
  assert.equal(hrefFromSnapshot('growth', snapshot), '/plugins/growth?view=todo&tab=all');
});
