import 'reflect-metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';
import { InventoryMovementType } from '@true-north/enum';

@Entity('inventory_movement')
export class InventoryMovement extends BaseEntity {
  @Column('varchar')
  itemId!: string;

  @Column('varchar')
  locationId!: string;

  @Column('varchar', { length: 16 })
  type!: InventoryMovementType | `${InventoryMovementType}`;

  @Column('real')
  quantity!: number;

  @Column('real')
  beforeQty!: number;

  @Column('real')
  afterQty!: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column('datetime')
  occurredAt!: Date;
}
