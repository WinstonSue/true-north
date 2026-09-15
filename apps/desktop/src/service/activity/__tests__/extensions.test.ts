import assert from 'node:assert/strict';
import test from 'node:test';
import { ExtensionRegistry, extensionPoints, mergeTodaySections } from '@true-north/plugin-sdk';
import { attachMainExtensions, getMainExtensionsOptional } from '../../../plugin/extensions.ts';

test('today collectors come from the unified main registry and disappear on uninstall', async () => {
  const registry = new ExtensionRegistry();
  attachMainExtensions(registry);
  registry.registerBatch('growth', [
    {
      point: extensionPoints.today,
      key: 'growth.todos',
      order: 10,
      value: {
        id: 'growth.todos',
        descriptor: { kind: 'list', titleKey: 'today.todos' },
        collect: async () => ({
          id: 'growth.todos',
          kind: 'list' as const,
          titleKey: 'today.todos',
          items: [{ id: '1', label: '写周报' }],
        }),
      },
    },
  ]);

  const parts = await Promise.all(
    (getMainExtensionsOptional()?.list(extensionPoints.today) || []).map(async (collector) => [
      await collector.collect(),
    ]),
  );
  assert.equal(mergeTodaySections(parts)[0]?.id, 'growth.todos');

  registry.unregisterOwner('growth');
  assert.deepEqual(getMainExtensionsOptional()?.list(extensionPoints.today) || [], []);
  attachMainExtensions(null);
});
