import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assemblePluginCatalog,
  parsePluginManifest,
  pluginPath,
  PLUGIN_API_VERSION,
} from '../src/index.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const FIRST_PARTY_PLUGIN_IDS = ['growth', 'expense', 'inventory', 'library'] as const;

const GoalDecomposeKey = 'growth.goalDecompose';
const TaskDecomposeKey = 'growth.taskDecompose';
const LIBRARY_EXTRACT_ACTION = 'library.extract';
const GROWTH_RESOURCE_GOAL = 'growth.goal';
const GROWTH_RESOURCE_TASK = 'growth.task';
const GROWTH_RESOURCE_TODO = 'growth.todo';
const EXPENSE_RESOURCE_TRANSACTION = 'expense.transaction';
const INVENTORY_RESOURCE_ITEM = 'inventory.item';
const INVENTORY_RESOURCE_LOCATION = 'inventory.location';
const INVENTORY_RESOURCE_MOVEMENT = 'inventory.movement';
const LIBRARY_RESOURCE_BOOKMARK = 'library.bookmark';
const growthPaths = { root: '/plugins/growth' };
const expensePaths = { root: '/plugins/expense' };
const inventoryPaths = { root: '/plugins/inventory' };
const libraryPaths = { root: '/plugins/library' };

function manifestSource(pluginId: string) {
  return readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/manifest.ts`), 'utf8');
}

function rendererSource(pluginId: string) {
  return readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/index.tsx`), 'utf8');
}

test('first-party packages keep unscoped plugin ids and current API version', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = manifestSource(pluginId);
    const pkg = JSON.parse(
      readFileSync(join(repoRoot, `packages/plugins/${pluginId}/package.json`), 'utf8'),
    ) as { version: string; exports?: Record<string, unknown> };
    assert.doesNotMatch(src, /apiVersion:/);
    assert.match(src, new RegExp(`pluginId: '${pluginId}'`));
    assert.match(src, /import \{ version \} from '\.\.\/package\.json'/);
    assert.match(src, /^\s*version,$/m);
    assert.match(src, /catalog:/);
    assert.doesNotMatch(src, /packageName:/);
    assert.doesNotMatch(src, /hostCapabilities:/);
    assert.equal(pkg.exports?.['./plugin'], undefined);
    assert.equal(typeof pkg.version, 'string');
    assert.notEqual(pkg.version.length, 0);
  }
  assert.equal((FIRST_PARTY_PLUGIN_IDS as readonly string[]).includes('ai'), false);
});

test('workflow is a host platform, not a catalog plugin', async () => {
  assert.equal(existsSync(join(repoRoot, 'packages/plugins/activity')), false);
  assert.equal(existsSync(join(repoRoot, 'packages/plugins/workflow')), false);
  assert.equal(existsSync(join(repoRoot, 'packages/plugins/purchase')), false);
  assert.equal(existsSync(join(repoRoot, 'apps/desktop/src/service/workflow')), true);

  const catalog = await assemblePluginCatalog(
    [
      parsePluginManifest({
        pluginId: 'growth',
        version: '0.1.0',
        catalog: { nameKey: 'menu.growth' },
        contributions: {
          ipc: { todo: {} },
          ai: { mcp: { tools: { searchGoals: { readOnly: true } } } },
          resources: { todo: { uriTemplate: 'tn://growth/todos/{id}' } },
        },
      }),
    ].map((manifest) => ({ manifest })),
    { side: 'manifest' },
  );
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'growth'), true);
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'workflow'), false);
});

test('first-party plugins open their own store and do not expose query ports', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const contribution = readFileSync(
      join(repoRoot, `packages/plugins/${pluginId}/src/main/contribution.ts`),
      'utf8',
    );
    const storage = readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/main/storage.ts`), 'utf8');
    assert.doesNotMatch(contribution, /query:/);
    assert.match(storage, /openPluginSqliteStore/);
  }
});

test('first-party renderer binds local-key maps instead of repeating catalog metadata', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = rendererSource(pluginId);
    assert.match(src, /defineRendererImplementation/);
    assert.match(src, /icon:/);
    assert.match(src, /hub:/);
    assert.doesNotMatch(src, /views:/);
    assert.doesNotMatch(src, /workbenchViews:/);
    assert.doesNotMatch(src, /entitySources:/);
    assert.doesNotMatch(src, /entityPresenters:/);
    assert.equal(existsSync(join(repoRoot, `packages/plugins/${pluginId}/src/plugin.ts`)), false);
  }
});

test('derived contribution ids stay namespaced', () => {
  assert.equal(GoalDecomposeKey, 'growth.goalDecompose');
  assert.equal(TaskDecomposeKey, 'growth.taskDecompose');
  assert.equal(LIBRARY_EXTRACT_ACTION, 'library.extract');
  assert.equal(pluginPath('growth'), '/plugins/growth');
  assert.equal(growthPaths.root, '/plugins/growth');
  assert.equal(expensePaths.root, '/plugins/expense');
  assert.equal(inventoryPaths.root, '/plugins/inventory');
  assert.equal(libraryPaths.root, '/plugins/library');
  assert.equal(GROWTH_RESOURCE_GOAL, 'growth.goal');
  assert.equal(GROWTH_RESOURCE_TASK, 'growth.task');
  assert.equal(GROWTH_RESOURCE_TODO, 'growth.todo');
  assert.equal(EXPENSE_RESOURCE_TRANSACTION, 'expense.transaction');
  assert.equal(INVENTORY_RESOURCE_ITEM, 'inventory.item');
  assert.equal(INVENTORY_RESOURCE_LOCATION, 'inventory.location');
  assert.equal(INVENTORY_RESOURCE_MOVEMENT, 'inventory.movement');
  assert.equal(LIBRARY_RESOURCE_BOOKMARK, 'library.bookmark');
});

test('first-party resources are declared and opened to Hub', () => {
  const expected = {
    growth: [GROWTH_RESOURCE_GOAL, GROWTH_RESOURCE_TASK, GROWTH_RESOURCE_TODO],
    expense: [EXPENSE_RESOURCE_TRANSACTION],
    inventory: [INVENTORY_RESOURCE_ITEM, INVENTORY_RESOURCE_LOCATION, INVENTORY_RESOURCE_MOVEMENT],
    library: [LIBRARY_RESOURCE_BOOKMARK],
  } as const;

  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = manifestSource(pluginId);
    const renderer = rendererSource(pluginId);
    const contribution = readFileSync(
      join(repoRoot, `packages/plugins/${pluginId}/src/main/contribution.ts`),
      'utf8',
    );
    assert.match(src, /resources:\s*\{/);
    assert.match(src, /hub:\s*\{\s*\}/);
    assert.doesNotMatch(src, /views:\s*\{/);
    assert.doesNotMatch(src, /newTabs:\s*\{/);
    assert.match(renderer, /openResource\(/);
    assert.match(renderer, /pluginId:/);
    assert.match(renderer, /location:/);
    assert.doesNotMatch(renderer, /views:\s*\{/);
    assert.doesNotMatch(renderer, /viewId:/);
    for (const id of expected[pluginId]) {
      const localId = id.slice(pluginId.length + 1);
      assert.match(src, new RegExp(`${localId}: \\{ uriTemplate:`));
      assert.match(contribution, new RegExp(`${localId}:`));
    }
  }
});

test('growth can register AI skills and mcp tools without an ai plugin', async () => {
  const catalog = await assemblePluginCatalog(
    [
      {
        manifest: parsePluginManifest({
          pluginId: 'growth',
          apiVersion: PLUGIN_API_VERSION,
          version: '0.1.0',
          catalog: { nameKey: 'menu.growth' },
          contributions: {
            ai: {
              skills: { goalDecompose: { root: 'skills/goal-decompose' } },
              mcp: { tools: { searchGoals: { readOnly: true } } },
            },
            workbench: { workspaces: { goalDecompose: {} } },
          },
        }),
      },
    ],
    { side: 'manifest' },
  );
  const growth = catalog.plugins.find((plugin) => plugin.manifest.pluginId === 'growth');
  assert.ok(growth);
  assert.equal(growth.manifest.contributions.ai?.skills?.goalDecompose?.root, 'skills/goal-decompose');
  assert.equal(growth.manifest.contributions.workbench?.workspaces?.goalDecompose !== undefined, true);
  assert.equal(catalog.issues.length, 0);
});

test('growth skill directories contain SKILL.md', () => {
  for (const skill of ['goal-decompose', 'task-decompose']) {
    assert.equal(
      existsSync(join(repoRoot, `packages/plugins/growth/skills/${skill}/SKILL.md`)),
      true,
    );
  }
});

test('host conflict skill lives at the desktop package root and is packaged', () => {
  const skillFile = join(repoRoot, 'apps/desktop/skills/conflict-assist/SKILL.md');
  assert.equal(existsSync(skillFile), true);
  assert.equal(readFileSync(skillFile, 'utf8').trim().length > 0, true);
  assert.equal(existsSync(join(repoRoot, 'apps/desktop/src/service/workflow/ai/skill/SKILL.md')), false);

  const pkg = JSON.parse(readFileSync(join(repoRoot, 'apps/desktop/package.json'), 'utf8')) as {
    build?: { files?: string[] };
  };
  assert.equal(pkg.build?.files?.includes('skills/**/*'), true);
});
