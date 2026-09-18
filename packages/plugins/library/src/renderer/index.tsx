import { Bookmark } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { libraryManifest } from '../manifest';
import { libraryExtractHandler } from './contributions/extract';
import { libraryLocales } from './locales';
import { bindPluginIpc } from '../client';
import { suggestBookmarkTool } from './contributions/suggest';

export function createRenderer() {
  return defineRendererImplementation(libraryManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Bookmark,
        locales: [libraryLocales],
        hub: {
          load: () => import('./layout/LibraryPage'),
        },
        workbench: {
          workspaces: {
            suggestBookmark: suggestBookmarkTool,
          },
          actions: {
            extract: {
              run: async (input) => {
                await libraryExtractHandler(input as never);
              },
            },
          },
        },
        openResource(uri) {
          const parsed = parsePluginResourceUri(uri);
          if (!parsed || parsed.pluginId !== 'library') return null;
          return {
            pluginId: 'library',
            location: parsed.id ? { view: 'search', id: parsed.id } : { view: 'search' },
          };
        },
      };
    },
  });
}
