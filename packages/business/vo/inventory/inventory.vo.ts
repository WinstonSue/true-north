import type { InventoryMovementType } from '@true-north/enum';
import type { BaseEntityVo } from '../common';

export type InventoryItemVo = BaseEntityVo & {
  name: string;
  category?: string;
  unit: string;
  minStock?: number;
  targetStock?: number;
  note?: string;
  archived?: boolean;
  revision: number;
  totalQuantity: number;
  restockQuantity: number;
  lowStock: boolean;
};

export type CreateInventoryItemVo = {
  name: string;
  category?: string;
  unit?: string;
  minStock?: number;
  targetStock?: number;
  note?: string;
  locationId?: string;
  locationName?: string;
  quantity?: number;
};

export type UpdateInventoryItemVo = Partial<Omit<CreateInventoryItemVo, 'locationId' | 'locationName' | 'quantity'>> & {
  archived?: boolean;
};

export type InventoryItemFilterVo = {
  keyword?: string;
  category?: string;
  lowStock?: boolean;
  archived?: boolean;
};

export type InventoryLocationVo = BaseEntityVo & {
  name: string;
  parentId?: string;
  note?: string;
  revision: number;
};

export type CreateInventoryLocationVo = {
  name: string;
  parentId?: string;
  note?: string;
};

export type UpdateInventoryLocationVo = Partial<CreateInventoryLocationVo>;

export type InventoryBalanceVo = {
  id: string;
  itemId: string;
  locationId: string;
  locationName?: string;
  quantity: number;
  revision: number;
};

export type InventoryMovementVo = BaseEntityVo & {
  itemId: string;
  itemName?: string;
  locationId: string;
  locationName?: string;
  type: InventoryMovementType | `${InventoryMovementType}`;
  quantity: number;
  beforeQty: number;
  afterQty: number;
  note?: string;
  occurredAt: string;
};

export type InventoryMovementFilterVo = {
  itemId?: string;
  locationId?: string;
  type?: InventoryMovementType | `${InventoryMovementType}`;
};

export type RecordInventoryMovementVo = {
  itemId: string;
  locationId?: string;
  locationName?: string;
  quantity?: number;
  targetQuantity?: number;
  note?: string;
  expectedRevision?: string;
};
