import { inventoryManifest } from '@true-north/plugin-inventory/manifest';
import { expenseManifest } from '@true-north/plugin-expense/manifest';
import { growthManifest } from '@true-north/plugin-growth/manifest';
import { libraryManifest } from '@true-north/plugin-library/manifest';
import type { PluginManifest } from '@true-north/plugin-sdk';

export const FIRST_PARTY_PLUGIN_IDS = ['growth', 'expense', 'inventory', 'library'] as const;
export type FirstPartyPluginId = (typeof FIRST_PARTY_PLUGIN_IDS)[number];

export type FirstPartyPluginMeta = {
  pluginId: FirstPartyPluginId;
  packageName: `@true-north/plugin-${FirstPartyPluginId}`;
  manifest: PluginManifest;
};

export const firstPartyPlugins = {
  growth: {
    pluginId: 'growth',
    packageName: '@true-north/plugin-growth',
    manifest: growthManifest,
  },
  expense: {
    pluginId: 'expense',
    packageName: '@true-north/plugin-expense',
    manifest: expenseManifest,
  },
  inventory: {
    pluginId: 'inventory',
    packageName: '@true-north/plugin-inventory',
    manifest: inventoryManifest,
  },
  library: {
    pluginId: 'library',
    packageName: '@true-north/plugin-library',
    manifest: libraryManifest,
  },
} as const satisfies Record<FirstPartyPluginId, FirstPartyPluginMeta>;
