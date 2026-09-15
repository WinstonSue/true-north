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
      search: { nameKey: 'menu.library', order: 10 },
    },
    page: {},
    workbench: {
      actions: { extract: {} },
    },
    activity: {
      captureTypes: { bookmark: {} },
      today: { bookmarks: { kind: 'metric', titleKey: 'plugins.hub.bookmarks', order: 30 } },
    },
  },
});

export default libraryManifest;
