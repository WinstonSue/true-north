import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const inventoryManifest = definePluginManifest({
  pluginId: 'inventory',
  version,
  catalog: {
    nameKey: 'menu.inventory',
    descriptionKey: 'inventory.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['inventory', 'stock', '物资', '库存', '入库', '出库'],
    order: 30,
  },
  contributions: {
    ipc: { inventory: {} },
    hub: {},
    resources: {
      item: { uriTemplate: 'tn://inventory/items/{id}' },
      location: { uriTemplate: 'tn://inventory/locations/{id}' },
      movement: { uriTemplate: 'tn://inventory/movements/{id}' },
    },
    workbench: {
      workspaces: {
        suggestItem: {},
        suggestMovement: {},
      },
    },
    workflow: {
      events: {
        itemCreated: { payloadSchema: { type: 'object' } },
        itemUpdated: { payloadSchema: { type: 'object' } },
        stockInbound: { payloadSchema: { type: 'object' } },
        stockOutbound: { payloadSchema: { type: 'object' } },
        stockAdjusted: { payloadSchema: { type: 'object' } },
      },
      commands: {
        createItem: { inputSchema: { type: 'object' }, idempotent: true },
        recordInbound: { inputSchema: { type: 'object' }, idempotent: true },
        recordOutbound: { inputSchema: { type: 'object' }, idempotent: true },
        adjustStock: { inputSchema: { type: 'object' }, idempotent: true },
      },
    },
    ai: {
      mcp: {
        tools: {
          suggestItem: {},
          suggestMovement: {},
        },
      },
    },
  },
});

export default inventoryManifest;
