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
    hub: {},
    resources: {
      bookmark: { uriTemplate: 'tn://library/bookmarks/{id}' },
    },
    workbench: {
      workspaces: { suggestBookmark: {} },
      actions: { extract: {} },
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
      },
    },
  },
});

export default libraryManifest;
