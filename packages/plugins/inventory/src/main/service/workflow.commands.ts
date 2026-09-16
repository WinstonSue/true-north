import type { CommandResult, WorkflowCommandContext } from '@true-north/plugin-contract';
import type { WorkflowCommandHandler } from '@true-north/plugin-sdk';
import { runPluginCommand, revisionOf } from '@true-north/plugin-sdk/main';
import { store } from '../storage';
import { InventoryItem } from './item.entity';
import { InventoryBalance } from './balance.entity';
import { inventoryService } from './inventory.service';
import {
  decideCreateItem,
  decideRecordMovement,
  itemUri,
  movementUri,
} from './workflow-cas';
import type { MovementType } from './stock';

function movementEvent(type: MovementType) {
  if (type === 'inbound') return 'stockInbound';
  if (type === 'outbound') return 'stockOutbound';
  return 'stockAdjusted';
}

export const createItemCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    const body = (input || {}) as Record<string, unknown>;
    const decision = decideCreateItem(String(body.title || body.name || ''));
    if (!('proceed' in decision)) return decision;
    return store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const created = await inventoryService.createItem(
          {
            name: decision.name,
            category: body.category ? String(body.category) : undefined,
            unit: body.unit ? String(body.unit) : undefined,
            minStock: body.minStock != null ? Number(body.minStock) : undefined,
            targetStock: body.targetStock != null ? Number(body.targetStock) : undefined,
            note: body.note ? String(body.note) : undefined,
            locationId: body.locationId ? String(body.locationId) : undefined,
            locationName: body.locationName ? String(body.locationName) : undefined,
            quantity: body.quantity != null ? Number(body.quantity) : undefined,
          },
          { manager: tx.manager },
        );
        const uri = itemUri(created.id);
        const revision = revisionOf(created.revision);
        return {
          status: 'applied',
          resource: { uri, revision },
          output: { id: created.id, name: created.name },
          events: [{ localId: 'itemCreated', payload: { title: created.name }, source: { uri, revision } }],
        };
      }),
    );
  },
};

function movementCommand(type: MovementType): WorkflowCommandHandler {
  return {
    async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
      const body = (input || {}) as Record<string, unknown>;
      return store().runInTransaction(async (tx) =>
        runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
          const itemId = String(body.itemId || '');
          const item = itemId ? await tx.manager.getRepository(InventoryItem).findOneBy({ id: itemId }) : null;
          const location = await inventoryService.ensureLocation(
            {
              locationId: body.locationId ? String(body.locationId) : undefined,
              locationName: body.locationName ? String(body.locationName) : undefined,
            },
            tx.manager,
          );
          const balance = item
            ? await tx.manager.getRepository(InventoryBalance).findOne({
                where: { itemId: item.id, locationId: location.id },
              })
            : null;
          const decision = decideRecordMovement(item, location, balance, {
            type,
            quantity: body.quantity != null ? Number(body.quantity) : undefined,
            targetQuantity: body.targetQuantity != null ? Number(body.targetQuantity) : undefined,
            expectedRevision: body.expectedRevision ? String(body.expectedRevision) : undefined,
          });
          if (!('proceed' in decision)) return decision;
          const recorded = await inventoryService.recordMovement(
            type,
            {
              itemId,
              locationId: location.id,
              quantity: body.quantity != null ? Number(body.quantity) : undefined,
              targetQuantity: body.targetQuantity != null ? Number(body.targetQuantity) : undefined,
              note: body.note ? String(body.note) : undefined,
            },
            { manager: tx.manager },
          );
          const uri = movementUri(recorded.id);
          const revision = revisionOf((balance?.revision || 1) + 1);
          return {
            status: 'applied',
            resource: { uri, revision },
            output: { id: recorded.id, itemId: recorded.itemId, afterQty: recorded.afterQty },
            events: [
              {
                localId: movementEvent(type),
                payload: { title: recorded.itemName, quantity: recorded.quantity },
                source: { uri: itemUri(recorded.itemId), revision },
              },
            ],
          };
        }),
      );
    },
  };
}

export const recordInboundCommand = movementCommand('inbound');
export const recordOutboundCommand = movementCommand('outbound');
export const adjustStockCommand = movementCommand('adjust');
