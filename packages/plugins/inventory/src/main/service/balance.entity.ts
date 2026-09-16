import 'reflect-metadata';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

@Entity('inventory_balance')
@Index('inventory_balance_item_location', ['itemId', 'locationId'], { unique: true })
export class InventoryBalance extends BaseEntity {
  @Column('varchar')
  itemId!: string;

  @Column('varchar')
  locationId!: string;

  @Column('real', { default: 0 })
  quantity!: number;

  @Column('int', { default: 1 })
  revision!: number;
}
