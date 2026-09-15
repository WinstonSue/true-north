import { contributionKey } from '@true-north/plugin-contract';
import { purchaseManifest } from '../manifest';

const PURCHASE_PLUGIN_ID = purchaseManifest.pluginId;

export const purchaseIds = {
  views: {
    list: contributionKey(PURCHASE_PLUGIN_ID, 'list'),
  },
  capture: {
    item: contributionKey(PURCHASE_PLUGIN_ID, 'item'),
  },
} as const;
