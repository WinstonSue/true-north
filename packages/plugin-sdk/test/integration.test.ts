import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PLUGIN_API_VERSION,
  assemblePluginCatalog,
  validateManifests,
  parsePluginManifest,
  normalizeCaptureSuggestion,
  mergeTodaySections,
} from '../src/index.ts';
import type { PluginManifest } from '../src/index.ts';

function manifest(overrides: Partial<PluginManifest> & Pick<PluginManifest, 'pluginId'>): PluginManifest {
  return parsePluginManifest({
    apiVersion: PLUGIN_API_VERSION,
    version: '0.1.0',
    catalog: { nameKey: overrides.pluginId },
    contributions: {},
    ...overrides,
  });
}

test('host catalog can assemble with no plugins', async () => {
  const catalog = await assemblePluginCatalog([], { side: 'manifest' });
  assert.deepEqual(catalog.plugins, []);
  assert.equal(catalog.issues.length, 0);
});

test('adding growth surfaces ipc, mcp tools, workbench and today', async () => {
  const catalog = await assemblePluginCatalog(
    [
      {
        manifest: manifest({
          pluginId: 'growth',
          contributions: {
            ipc: { todo: {} },
            ai: { mcp: { tools: { searchGoals: { readOnly: true } } } },
            workbench: { workspaces: { goalDecompose: {} } },
            activity: {
              today: { todos: { kind: 'list', titleKey: 'today.todos' } },
            },
          },
        }),
      },
    ],
    { side: 'manifest' },
  );
  const growth = catalog.plugins.find((plugin) => plugin.manifest.pluginId === 'growth');
  assert.ok(growth);
  assert.equal(growth.manifest.contributions.ipc?.todo !== undefined, true);
  assert.equal(growth.manifest.contributions.ai?.mcp?.tools?.searchGoals?.readOnly, true);
  assert.equal(growth.manifest.contributions.workbench?.workspaces?.goalDecompose !== undefined, true);
  assert.equal(growth.manifest.contributions.activity?.today?.todos?.kind, 'list');
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'ai'), false);
});

test('capture suggestion normalizes missing type from kind', () => {
  const next = normalizeCaptureSuggestion({ id: 's1', kind: 'todo', payload: { title: 'x' } } as never);
  assert.equal(next.type, 'todo');
  assert.equal(next.status, 'selected');
});

test('today sections merge across plugins', () => {
  const merged = mergeTodaySections([
    [{ id: 'growth.todos', kind: 'list', titleKey: 'todo', items: [{ id: '1', label: 'a' }] }],
    [{ id: 'growth.habits', kind: 'list', titleKey: 'habit', items: [{ id: 'h', label: 'b' }] }],
  ]);
  assert.equal(merged.length, 2);
  assert.equal(merged.flatMap((section) => section.items || []).length, 2);
});

test('duplicate mcp tool names still fail catalog validation', () => {
  const issues = validateManifests([
    manifest({
      pluginId: 'growth',
      contributions: { ai: { mcp: { tools: { shared: {} } } } },
    }),
    manifest({
      pluginId: 'growth',
      contributions: { ai: { mcp: { tools: { shared: {} } } } },
    }),
  ]);
  assert.equal(issues.some((issue) => issue.code === 'duplicate-plugin'), true);
});
