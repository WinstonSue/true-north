import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ExtensionRegistry,
  extensionPoints,
  type PluginResourceProvider,
} from '@true-north/plugin-sdk';
import { attachMainExtensions } from '../../../plugin/extensions.ts';
import { MENTION_LIMIT, searchResourceMentions } from '../extension-queries.ts';

function provider(
  rows: Array<{ uri: string; name: string }>,
  options?: { fail?: boolean; searchable?: boolean },
): PluginResourceProvider {
  const list = async () => {
    if (options?.fail) throw new Error('provider failed');
    return rows.map((row) => ({ uri: row.uri, name: row.name, mimeType: 'application/json' }));
  };
  return {
    list,
    read: async () => null,
    ...(options?.searchable === false
      ? {}
      : {
          search: async (query: string) => {
            const keyword = query.trim().toLowerCase();
            return (await list()).filter((row) => !keyword || (row.name || '').toLowerCase().includes(keyword));
          },
        }),
  };
}

test('mention search is ordered, isolated, capped, and cleared on uninstall', async () => {
  const registry = new ExtensionRegistry();
  attachMainExtensions(registry);
  registry.registerBatch('growth', [
    {
      point: extensionPoints.mention,
      key: 'growth.goal',
      order: 10,
      value: {
        pluginId: 'growth',
        localId: 'goal',
        labelKey: 'menu.goal',
        provider: provider([
          { uri: 'tn://growth/goals/g1', name: '完成产品化' },
          { uri: 'tn://growth/goals/g2', name: '健身' },
        ]),
      },
    },
    {
      point: extensionPoints.mention,
      key: 'growth.task',
      order: 20,
      value: {
        pluginId: 'growth',
        localId: 'task',
        labelKey: 'menu.task',
        provider: provider([{ uri: 'tn://growth/tasks/t1', name: '写周报' }]),
      },
    },
    {
      point: extensionPoints.mention,
      key: 'growth.broken',
      order: 15,
      value: {
        pluginId: 'growth',
        localId: 'broken',
        labelKey: 'menu.broken',
        provider: provider([], { fail: true }),
      },
    },
  ]);

  const all = await searchResourceMentions('');
  assert.deepEqual(
    all.map((item) => item.uri),
    ['tn://growth/goals/g1', 'tn://growth/goals/g2', 'tn://growth/tasks/t1'],
  );
  assert.equal(all[0]?.labelKey, 'menu.goal');
  assert.equal(all[0]?.sourceId, 'growth.goal');

  const filtered = await searchResourceMentions('周');
  assert.deepEqual(
    filtered.map((item) => item.uri),
    ['tn://growth/tasks/t1'],
  );

  registry.unregisterOwner('growth');
  assert.deepEqual(await searchResourceMentions(''), []);
  attachMainExtensions(null);
});

test('mention search falls back to list and respects the global cap', async () => {
  const registry = new ExtensionRegistry();
  attachMainExtensions(registry);
  const rows = Array.from({ length: 20 }, (_, index) => ({
    uri: `tn://growth/goals/g${index}`,
    name: `目标 ${index}`,
  }));
  registry.registerBatch('growth', [
    {
      point: extensionPoints.mention,
      key: 'growth.goal',
      order: 10,
      value: {
        pluginId: 'growth',
        localId: 'goal',
        labelKey: 'menu.goal',
        provider: provider(rows, { searchable: false }),
      },
    },
  ]);
  const found = await searchResourceMentions('目标 1');
  assert.equal(found.length <= MENTION_LIMIT, true);
  assert.equal(found[0]?.label, '目标 1');
  const capped = await searchResourceMentions('');
  assert.equal(capped.length, MENTION_LIMIT);
  attachMainExtensions(null);
});
