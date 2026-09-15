import { Bookmark } from 'lucide-react';
import { defineRendererImplementation, parsePluginResourceUri } from '@true-north/plugin-sdk';
import { libraryManifest } from '../manifest';
import { libraryIds } from '../contract';
import { libraryExtractHandler } from './contributions/extract';
import { libraryLocales } from './locales';
import { bindPluginIpc } from '../client';

export function createRenderer() {
  return defineRendererImplementation(libraryManifest, {
    activate(ctx) {
      bindPluginIpc(ctx.ipc);
      return {
        icon: Bookmark,
        locales: [libraryLocales],
        views: {
          search: { load: () => import('./features/search') },
        },
        workbench: {
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
          return { viewId: libraryIds.views.search, params: parsed.id ? { id: parsed.id } : {} };
        },
      };
    },
  });
}
