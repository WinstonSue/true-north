import { PurchaseStatus } from '@true-north/enum';
import { defineMainImplementation, pluginResourceUri, type PluginMainContext } from '@true-north/plugin-sdk';
import { purchaseManifest } from '../manifest';
import { PurchaseController } from './service/purchase.route-controller';
import { purchaseCaptureAdopter } from './service/capture.adopter';
import { purchaseService } from './service/purchase.service';
import { bindPurchaseContext } from './context';
import { activateStorage, disposeStorage } from './storage';

export function createPurchaseMain() {
  return defineMainImplementation(purchaseManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindPurchaseContext(ctx.activity);
      const purchases = async () => purchaseService.list({ status: PurchaseStatus.PENDING });
      return {
        ipc: { purchase: { controller: new PurchaseController() } },
        activity: {
          capture: { item: { adopt: (suggestion) => purchaseCaptureAdopter.adopt(suggestion) } },
          today: {
            pending: {
              async collect() {
                const list = await purchases();
                return { value: list.length };
              },
            },
            purchases: {
              async collect() {
                const list = await purchases();
                return {
                  items: list.map((item) => ({
                    id: item.id,
                    label: item.name,
                    pluginId: 'purchase',
                    uri: pluginResourceUri('purchase', 'purchases', item.id),
                  })),
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
