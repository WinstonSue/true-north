import { defineMainImplementation, type PluginMainContext } from '@true-north/plugin-sdk';
import { inventoryManifest } from '../manifest';
import { InventoryController } from './service/inventory.route-controller';
import { bindInventoryContext } from './context';
import { activateStorage, disposeStorage } from './storage';
import {
  adjustStockCommand,
  createItemCommand,
  recordInboundCommand,
  recordOutboundCommand,
} from './service/workflow.commands';
import {
  itemResource,
  locationResource,
  movementResource,
  suggestItemTool,
  suggestMovementTool,
} from './service/ai';

export function createInventoryMain() {
  return defineMainImplementation(inventoryManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindInventoryContext(ctx);
      return {
        ipc: { inventory: { controller: new InventoryController() } },
        workflow: {
          commands: {
            createItem: createItemCommand,
            recordInbound: recordInboundCommand,
            recordOutbound: recordOutboundCommand,
            adjustStock: adjustStockCommand,
          },
        },
        ai: {
          mcp: {
            tools: {
              suggestItem: suggestItemTool,
              suggestMovement: suggestMovementTool,
            },
          },
        },
        resources: {
          item: itemResource,
          location: locationResource,
          movement: movementResource,
        },
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
