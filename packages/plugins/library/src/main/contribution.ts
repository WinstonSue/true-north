import { defineMainImplementation, type PluginMainContext } from '@true-north/plugin-sdk';
import { libraryManifest } from '../manifest';
import { LibraryController } from './service/bookmark.route-controller';
import { bindLibraryContext } from './context';
import { activateStorage, disposeStorage } from './storage';
import { createBookmarkCommand } from './service/workflow.commands';
import { bookmarkResource, suggestBookmarkTool } from './service/ai';

export function createLibraryMain() {
  return defineMainImplementation(libraryManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindLibraryContext(ctx);
      return {
        ipc: { library: { controller: new LibraryController() } },
        workflow: {
          commands: {
            createBookmark: createBookmarkCommand,
          },
        },
        ai: {
          mcp: {
            tools: { suggestBookmark: suggestBookmarkTool },
          },
        },
        resources: { bookmark: bookmarkResource },
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
