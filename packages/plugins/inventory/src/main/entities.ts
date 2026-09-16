import { PluginCommandLedger } from '@true-north/plugin-sdk/main';
import { InventoryItem } from './service/item.entity';
import { InventoryLocation } from './service/location.entity';
import { InventoryBalance } from './service/balance.entity';
import { InventoryMovement } from './service/movement.entity';

export const inventoryEntities = [
  InventoryItem,
  InventoryLocation,
  InventoryBalance,
  InventoryMovement,
  PluginCommandLedger,
];
