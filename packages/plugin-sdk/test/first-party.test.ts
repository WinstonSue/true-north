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
  WORKBENCH_EXTRACT_ACTION,
} from '../src/index.ts';
import { growthPaths, GoalDecomposeKey, TaskDecomposeKey, GROWTH_VIEW_TODO, GROWTH_VIEW_TASK, GROWTH_VIEW_HABIT, GROWTH_VIEW_GOAL } from '../../plugins/growth/src/contract/index.ts';
import { expensePaths, EXPENSE_VIEW_TRANSACTION, EXPENSE_VIEW_BUDGET, EXPENSE_VIEW_OVERVIEW } from '../../plugins/expense/src/contract/index.ts';
import { purchasePaths, PURCHASE_VIEW_LIST } from '../../plugins/purchase/src/contract/index.ts';
import { libraryPaths, LIBRARY_EXTRACT_ACTION, LIBRARY_VIEW_SEARCH } from '../../plugins/library/src/contract/index.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const FIRST_PARTY_PLUGIN_IDS = ['growth', 'expense', 'purchase', 'library'] as const;

function pluginSource(pluginId: string) {
  return readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/plugin.ts`), 'utf8');
}

function rendererSource(pluginId: string) {
  return readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/index.tsx`), 'utf8');
}

function viewSource(pluginId: string) {
  return readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/views.ts`), 'utf8');
}

test('first-party packages keep unscoped plugin ids and current API version', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = pluginSource(pluginId);
    const pkg = JSON.parse(
      readFileSync(join(repoRoot, `packages/plugins/${pluginId}/package.json`), 'utf8'),
    ) as { version: string };
    assert.match(src, /apiVersion: PLUGIN_API_VERSION/);
    assert.match(src, new RegExp(`pluginId: '${pluginId}'`));
    assert.match(src, /import \{ version \} from '\.\.\/package\.json'/);
    assert.match(src, /^\s*version,$/m);
    assert.match(src, /catalog:/);
    assert.doesNotMatch(src, /packageName:/);
    assert.doesNotMatch(src, /displayName:/);
    assert.doesNotMatch(src, /storageCapability:/);
    assert.doesNotMatch(src, /required:/);
    assert.equal(typeof pkg.version, 'string');
    assert.notEqual(pkg.version.length, 0);
  }
  assert.equal((FIRST_PARTY_PLUGIN_IDS as readonly string[]).includes('ai'), false);
  assert.equal((FIRST_PARTY_PLUGIN_IDS as readonly string[]).includes('workbench'), false);
  assert.equal((FIRST_PARTY_PLUGIN_IDS as readonly string[]).includes('activity'), false);
});

test('activity is a host platform, not a catalog plugin', async () => {
  assert.equal(existsSync(join(repoRoot, 'packages/plugins/activity')), false);
  assert.equal(existsSync(join(repoRoot, 'apps/desktop/src/service/activity')), true);

  const catalog = await assemblePluginCatalog(
    [
      parsePluginManifest({
        pluginId: 'growth',
        apiVersion: PLUGIN_API_VERSION,
        version: '0.1.0',
        catalog: { nameKey: 'menu.growth' },
        contributions: {
          ipc: { todo: { routePrefix: '/todo' } },
          ai: { capabilities: { decompose: { key: GoalDecomposeKey } } },
          workbench: { workspaces: { decompose: { key: GoalDecomposeKey } } },
          activity: {
            today: { todos: { kind: 'list', titleKey: 'today.todos' } },
            entityTypes: ['todo'],
          },
        },
      }),
    ].map((manifest) => ({ manifest })),
    { side: 'manifest' },
  );
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'growth'), true);
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'activity'), false);
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'ai'), false);
  assert.equal(catalog.plugins.some((plugin) => plugin.manifest.pluginId === 'workbench'), false);
});

test('first-party plugins expose a query port and open their own store', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const contribution = readFileSync(
      join(repoRoot, `packages/plugins/${pluginId}/src/main/contribution.ts`),
      'utf8',
    );
    const storage = readFileSync(join(repoRoot, `packages/plugins/${pluginId}/src/main/storage.ts`), 'utf8');
    assert.match(contribution, /query:/);
    assert.match(storage, /openPluginSqliteStore/);
  }
});

test('first-party renderer binds implementations instead of repeating catalog metadata', () => {
  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = rendererSource(pluginId);
    assert.match(src, /defineRendererImplementation/);
    assert.match(src, /icon:/);
    assert.match(src, /load:/);
    assert.match(src, /workbenchViews:/);
    assert.doesNotMatch(src, /pages:/);
    assert.doesNotMatch(src, /hub:/);
    assert.equal(existsSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/views.ts`)), true);
  }
});

test('persisted capability, tool, workspace, and page ids stay stable', () => {
  assert.equal(GoalDecomposeKey, 'goal.decompose');
  assert.equal(TaskDecomposeKey, 'task.decompose');
  assert.match(
    readFileSync(join(repoRoot, 'packages/business/enum/activity/activity.enum.ts'), 'utf8'),
    /ActivityCaptureKey = 'activity.capture'/,
  );
  assert.equal(LIBRARY_EXTRACT_ACTION, 'library.extract');
  assert.equal(pluginPath('growth'), '/plugins/growth');
  assert.equal(growthPaths.root, '/plugins/growth');
  assert.equal(expensePaths.root, '/plugins/expense');
  assert.equal(purchasePaths.root, '/plugins/purchase');
  assert.equal(libraryPaths.root, '/plugins/library');
  assert.equal(WORKBENCH_EXTRACT_ACTION, 'workbench.extract');
  assert.equal(GROWTH_VIEW_TODO, 'growth.todo');
  assert.equal(GROWTH_VIEW_TASK, 'growth.task');
  assert.equal(GROWTH_VIEW_HABIT, 'growth.habit');
  assert.equal(GROWTH_VIEW_GOAL, 'growth.goal');
  assert.equal(EXPENSE_VIEW_TRANSACTION, 'expense.transaction');
  assert.equal(EXPENSE_VIEW_BUDGET, 'expense.budget');
  assert.equal(EXPENSE_VIEW_OVERVIEW, 'expense.overview');
  assert.equal(PURCHASE_VIEW_LIST, 'purchase.list');
  assert.equal(LIBRARY_VIEW_SEARCH, 'library.search');
  assert.match(pluginSource('growth'), /GoalDecomposeKey/);
  assert.match(pluginSource('growth'), /TaskDecomposeKey/);
  assert.match(pluginSource('growth'), /rules:/);
  assert.match(pluginSource('growth'), /growth\.goal\.priority-inheritance/);
  assert.match(pluginSource('library'), /LIBRARY_EXTRACT_ACTION/);
});

test('first-party workbench views match manifests and stay independently loadable', () => {
  const expected = {
    growth: [GROWTH_VIEW_TODO, GROWTH_VIEW_TASK, GROWTH_VIEW_HABIT, GROWTH_VIEW_GOAL],
    expense: [EXPENSE_VIEW_TRANSACTION, EXPENSE_VIEW_BUDGET, EXPENSE_VIEW_OVERVIEW],
    purchase: [PURCHASE_VIEW_LIST],
    library: [LIBRARY_VIEW_SEARCH],
  } as const;

  for (const pluginId of FIRST_PARTY_PLUGIN_IDS) {
    const src = pluginSource(pluginId);
    const viewsSrc = viewSource(pluginId);
    assert.match(src, /views:\s*\{/);
    for (const id of expected[pluginId]) {
      const localId = id.slice(pluginId.length + 1);
      assert.match(src, new RegExp(`${localId}: \\{ nameKey:`));
      assert.match(viewsSrc, new RegExp(`pluginId: '${pluginId}'`));
      assert.match(viewsSrc, new RegExp(`import\\('\\./features/${localId}'\\)`));
      assert.equal(existsSync(join(repoRoot, `packages/plugins/${pluginId}/src/renderer/features/${localId}.tsx`)), true);
    }
  }
});

test('growth can register AI and workbench contributions without ai/workbench plugins', async () => {
  const catalog = await assemblePluginCatalog(
    [
      {
        manifest: parsePluginManifest({
          pluginId: 'growth',
          apiVersion: PLUGIN_API_VERSION,
          version: '0.1.0',
          catalog: { nameKey: 'menu.growth' },
          contributions: {
            ai: { capabilities: { decompose: { key: GoalDecomposeKey } }, tools: { search_goals: { name: 'search_goals' } } },
            workbench: { workspaces: { decompose: { key: GoalDecomposeKey } } },
          },
        }),
      },
    ],
    { side: 'manifest' },
  );
  const growth = catalog.plugins.find((plugin) => plugin.manifest.pluginId === 'growth');
  assert.ok(growth);
  assert.equal(growth.manifest.contributions.ai?.capabilities?.decompose?.key, GoalDecomposeKey);
  assert.equal(growth.manifest.contributions.workbench?.workspaces?.decompose?.key, GoalDecomposeKey);
  assert.equal(catalog.issues.length, 0);
});
