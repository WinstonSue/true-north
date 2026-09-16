import { pluginResourceUri, type CommandResult } from '@true-north/plugin-contract';
import { revisionOf } from '@true-north/plugin-sdk';
import { applyQuantityDelta, type MovementType } from './stock.ts';

export type ItemSnapshot = {
  id: string;
  name: string;
  archived?: boolean;
  revision?: number | null;
};

export type LocationSnapshot = {
  id: string;
  name: string;
};

export type BalanceSnapshot = {
  id: string;
  quantity: number;
  revision?: number | null;
};

export function itemUri(id: string) {
  return pluginResourceUri('inventory', 'items', id);
}

export function locationUri(id: string) {
  return pluginResourceUri('inventory', 'locations', id);
}

export function movementUri(id: string) {
  return pluginResourceUri('inventory', 'movements', id);
}

export function parseResourceId(uri: string | undefined, collection: string) {
  const prefix = `tn://inventory/${collection}/`;
  if (!uri?.startsWith(prefix)) return '';
  return uri.slice(prefix.length);
}

export function decideCreateItem(name?: string): CommandResult | { proceed: true; name: string } {
  const trimmed = name?.trim();
  if (!trimmed) return { status: 'rejected', code: 'validation', reason: 'missing item name' };
  return { proceed: true, name: trimmed };
}

export function decideRecordMovement(
  item: ItemSnapshot | null,
  location: LocationSnapshot | null,
  balance: BalanceSnapshot | null,
  input: {
    type: MovementType;
    quantity?: number;
    targetQuantity?: number;
    expectedRevision?: string;
  },
): CommandResult | { proceed: true; actual: string; currentQty: number } {
  if (!item) return { status: 'notFound', uri: undefined };
  if (item.archived) {
    return { status: 'rejected', code: 'precondition', reason: 'item is archived' };
  }
  if (!location) return { status: 'rejected', code: 'validation', reason: 'missing location' };
  const currentQty = balance?.quantity ?? 0;
  const actual = revisionOf(balance?.revision || 1);
  if (input.expectedRevision && input.expectedRevision !== actual) {
    return {
      status: 'conflict',
      expectedRevision: input.expectedRevision,
      actualRevision: actual,
      resource: { uri: itemUri(item.id), revision: actual },
      reason: 'balance revision mismatch',
    };
  }
  const applied = applyQuantityDelta(currentQty, input.type, input.quantity, input.targetQuantity);
  if ('error' in applied) {
    return { status: 'rejected', code: 'validation', reason: applied.error };
  }
  return { proceed: true, actual, currentQty };
}
