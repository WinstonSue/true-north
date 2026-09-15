import { ShoppingCart } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { purchaseManifest } from '../manifest';
import { purchaseIds } from '../contract';
import { purchaseLocales } from './locales';
import { bindPluginIpc } from '../client';

export function createRenderer() {
  return defineRendererImplementation(purchaseManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: ShoppingCart,
        locales: [purchaseLocales],
        views: {
          list: { load: () => import('./features/list') },
        },
        page: {
          load: () => import('./layout/PurchasePage'),
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'purchase') return null;
          return {
            viewId: purchaseIds.views.list,
            params: parsed.id ? { view: 'list', id: parsed.id } : { view: 'list' },
          };
        },
      };
    },
  });
}
