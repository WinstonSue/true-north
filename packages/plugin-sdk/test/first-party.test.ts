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
const FIRST_PARTY_PLUGIN_IDS = ['growth', 'expense', 'purchase', 'library'] as const;

const GoalDecomposeKey = 'growth.goalDecompose';
const TaskDecomposeKey = 'growth.taskDecompose';
const LIBRARY_EXTRACT_ACTION = 'library.extract';
const GROWTH_VIEW_TODO = 'growth.todo';
const GROWTH_VIEW_TASK = 'growth.task';
const GROWTH_VIEW_HABIT = 'growth.habit';
const GROWTH_VIEW_GOAL = 'growth.goal';
const EXPENSE_VIEW_TRANSACTION = 'expense.transaction';
const EXPENSE_VIEW_BUDGET = 'expense.budget';
const EXPENSE_VIEW_OVERVIEW = 'expense.overview';
const PURCHASE_VIEW_LIST = 'purchase.list';
const LIBRARY_VIEW_SEARCH = 'library.search';
const growthPaths = { root: '/plugins/growth' };
const expensePaths = { root: '/plugins/expense' };
const purchasePaths = { root: '/plugins/purchase' };
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

test('activity is a host platform, not a catalog plugin', async () => {
  assert.equal(existsSync(join(repoRoot, 'packages/plugins/activity')), false);
  assert.equal(existsSync(join(repoRoot, 'apps/desktop/src/service/activity')), true);

  const catalog = await assemblePluginCatalog(
    [
      parsePluginManifest({
        pluginId: 'growth',
        version: '0.1.0',
        catalog: { nameKey: 'menu.growth' },
        contributions: {
          ipc: { todo: {} },
          ai: { mcp: { tools: { searchGoals: { readOnly: true } } } },
          views: { todo: { nameKey: 'menu.todo' } },
        },
      }),
    ].map((manifest) => ({ manifest })),
    { side: 'manifest' },
  );
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'growth'), true);
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'activity'), false);
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
    assert.match(src, /views:/);
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
  assert.equal(purchasePaths.root, '/plugins/purchase');
  assert.equal(libraryPaths.root, '/plugins/library');
  assert.equal(GROWTH_VIEW_TODO, 'growth.todo');
  assert.equal(GROWTH_VIEW_TASK, 'growth.task');
  assert.equal(GROWTH_VIEW_HABIT, 'growth.habit');
  assert.equal(GROWTH_VIEW_GOAL, 'growth.goal');
  assert.equal(EXPENSE_VIEW_TRANSACTION, 'expense.transaction');
  assert.equal(EXPENSE_VIEW_BUDGET, 'expense.budget');
  assert.equal(EXPENSE_VIEW_OVERVIEW, 'expense.overview');
  assert.equal(PURCHASE_VIEW_LIST, 'purchase.list');
  assert.equal(LIBRARY_VIEW_SEARCH, 'library.search');
});

test('first-party workbench views stay independently loadable', () => {
  const expected = {
    growth: [GROWTH_VIEW_TODO, GROWTH_VIEW_TASK, GROWTH_VIEW_HABIT, GROWTH_VIEW_GOAL],
    expense: [EXPENSE_VIEW_TRANSACTION, EXPENSE_VIEW_BUDGET, EXPENSE_VIEW_OVERVIEW],
    purchase: [PURCHASE_VIEW_LIST],
    library: [LIBRARY_VIEW_SEARCH],
  } as const;

  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = manifestSource(pluginId);
    const renderer = rendererSource(pluginId);
    assert.match(src, /views:\s*\{/);
    for (const id of expected[pluginId]) {
      const localId = id.slice(pluginId.length + 1);
      assert.match(src, new RegExp(`${localId}: \\{ nameKey:`));
      assert.match(renderer, new RegExp(`import\\('\\./features/${localId}'\\)`));
      assert.equal(existsSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/features/${localId}.tsx`)), true);
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
