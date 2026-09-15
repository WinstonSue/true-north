import { contributionKey, pluginPath, pluginResourceUri } from '@true-north/plugin-contract';
import { purchaseManifest } from '../manifest';

export const PURCHASE_PLUGIN_ID = purchaseManifest.pluginId;
export const purchasePaths = {
  root: pluginPath(PURCHASE_PLUGIN_ID),
} as const;

export const purchaseIds = {
  views: {
    list: contributionKey(PURCHASE_PLUGIN_ID, 'list'),
  },
  capture: {
    item: contributionKey(PURCHASE_PLUGIN_ID, 'item'),
  },
} as const;

export const PURCHASE_VIEW_LIST = purchaseIds.views.list;

export function purchaseItemUri(id: string) {
  return pluginResourceUri(PURCHASE_PLUGIN_ID, 'purchases', id);
}
