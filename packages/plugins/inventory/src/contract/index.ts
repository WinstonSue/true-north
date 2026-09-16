import { contributionKey } from '@true-north/plugin-contract';
import { inventoryManifest } from '../manifest';

const PLUGIN_ID = inventoryManifest.pluginId;

export const inventoryIds = {
  views: {
    items: contributionKey(PLUGIN_ID, 'items'),
    locations: contributionKey(PLUGIN_ID, 'locations'),
    movements: contributionKey(PLUGIN_ID, 'movements'),
  },
  workspaces: {
    suggestItem: contributionKey(PLUGIN_ID, 'suggestItem'),
    suggestMovement: contributionKey(PLUGIN_ID, 'suggestMovement'),
  },
} as const;
