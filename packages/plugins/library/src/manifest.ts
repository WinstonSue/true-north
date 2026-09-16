import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const libraryManifest = definePluginManifest({
  pluginId: 'library',
  version,
  catalog: {
    nameKey: 'menu.library',
    descriptionKey: 'library.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['bookmark', 'library', '收藏', '书签'],
    order: 40,
  },
  contributions: {
    ipc: { library: {} },
    views: {
      search: { nameKey: 'menu.library' },
    },
    hub: {},
    workbench: {
      workspaces: { suggestBookmark: {} },
      actions: { extract: {} },
      newTabs: {
        search: { order: 10 },
      },
    },
    workflow: {
      events: {
        bookmarkCreated: { payloadSchema: { type: 'object' } },
        bookmarkDeleted: { payloadSchema: { type: 'object' } },
      },
      commands: {
        createBookmark: { inputSchema: { type: 'object' }, idempotent: true },
      },
    },
    ai: {
      mcp: {
        tools: {
          suggestBookmark: {},
        },
        resources: {
          bookmark: { uriTemplate: 'tn://library/bookmarks/{id}' },
        },
      },
    },
  },
});

export default libraryManifest;
