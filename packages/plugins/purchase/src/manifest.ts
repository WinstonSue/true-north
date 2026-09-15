import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const purchaseManifest = definePluginManifest({
  pluginId: 'purchase',
  version,
  catalog: {
    nameKey: 'menu.purchase',
    descriptionKey: 'purchase.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['purchase', 'buy', '采购', '待购'],
    order: 30,
  },
  contributions: {
    ipc: { purchase: {} },
    views: {
      list: { nameKey: 'menu.purchase', order: 10 },
    },
    page: {},
    activity: {
      captureTypes: { item: {} },
      today: {
        pending: { kind: 'metric', titleKey: 'plugins.hub.pendingPurchases', order: 20 },
        purchases: { kind: 'list', titleKey: 'menu.purchase', order: 40 },
      },
    },
  },
});

export default purchaseManifest;
