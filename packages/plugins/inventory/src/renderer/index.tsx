import { Package } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { inventoryManifest } from '../manifest';
import { inventoryLocales } from './locales';
import { bindPluginIpc } from '../client';
import { suggestItemTool, suggestMovementTool } from './contributions/suggest';

export function createRenderer() {
  return defineRendererImplementation(inventoryManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Package,
        locales: [inventoryLocales],
        hub: {
          load: () => import('./layout/InventoryPage'),
        },
        workbench: {
          workspaces: {
            suggestItem: suggestItemTool,
            suggestMovement: suggestMovementTool,
          },
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'inventory') return null;
          const view =
            parsed.collection === 'locations'
              ? 'locations'
              : parsed.collection === 'movements'
                ? 'movements'
                : 'items';
          return {
            pluginId: 'inventory',
            location: parsed.id ? { view, id: parsed.id } : { view },
          };
        },
      };
    },
  });
}
