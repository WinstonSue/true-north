import { contributionKey } from '@true-north/plugin-contract';
import { libraryManifest } from '../manifest';

const LIBRARY_PLUGIN_ID = libraryManifest.pluginId;

export const libraryIds = {
  views: {
    search: contributionKey(LIBRARY_PLUGIN_ID, 'search'),
  },
  actions: {
    extract: contributionKey(LIBRARY_PLUGIN_ID, 'extract'),
  },
  capture: {
    bookmark: contributionKey(LIBRARY_PLUGIN_ID, 'bookmark'),
  },
} as const;
