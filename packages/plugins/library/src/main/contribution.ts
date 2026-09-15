import dayjs from 'dayjs';
import { defineMainImplementation, pluginResourceUri, type PluginMainContext } from '@true-north/plugin-sdk';
import { libraryManifest } from '../manifest';
import { LibraryController } from './service/bookmark.route-controller';
import { bookmarkCaptureAdopter } from './service/capture.adopter';
import { bookmarkService } from './service/bookmark.service';
import { bindLibraryContext } from './context';
import { activateStorage, disposeStorage } from './storage';

export function createLibraryMain() {
  return defineMainImplementation(libraryManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindLibraryContext(ctx.activity);
      return {
        ipc: { library: { controller: new LibraryController() } },
        activity: {
          capture: { bookmark: { adopt: (suggestion) => bookmarkCaptureAdopter.adopt(suggestion) } },
          today: {
            bookmarks: {
              async collect() {
                const todayDate = dayjs().format('YYYY-MM-DD');
                const bookmarks = await bookmarkService.list();
                return {
                  value: bookmarks.filter((item) => dayjs(item.savedAt).format('YYYY-MM-DD') === todayDate).length,
                };
              },
            },
          },
        },
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
