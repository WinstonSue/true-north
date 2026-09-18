import { contributionKey } from '@true-north/plugin-contract';
import { inventoryManifest } from '../manifest';

const PLUGIN_ID = inventoryManifest.pluginId;

export const inventoryIds = {
  resources: {
    item: contributionKey(PLUGIN_ID, 'item'),
    location: contributionKey(PLUGIN_ID, 'location'),
    movement: contributionKey(PLUGIN_ID, 'movement'),
  },
  workspaces: {
    suggestItem: contributionKey(PLUGIN_ID, 'suggestItem'),
    suggestMovement: contributionKey(PLUGIN_ID, 'suggestMovement'),
  },
} as const;
