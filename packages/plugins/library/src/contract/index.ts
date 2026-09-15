import { contributionKey, pluginPath, pluginResourceUri } from '@true-north/plugin-contract';
import { libraryManifest } from '../manifest';

export const LIBRARY_PLUGIN_ID = libraryManifest.pluginId;
export const libraryPaths = {
  root: pluginPath(LIBRARY_PLUGIN_ID),
} as const;

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

export const LIBRARY_EXTRACT_ACTION = libraryIds.actions.extract;
export const LIBRARY_VIEW_SEARCH = libraryIds.views.search;

export function libraryBookmarkUri(id: string) {
  return pluginResourceUri(LIBRARY_PLUGIN_ID, 'bookmarks', id);
}
