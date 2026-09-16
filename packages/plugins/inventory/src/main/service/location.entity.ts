import 'reflect-metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

@Entity('inventory_location')
export class InventoryLocation extends BaseEntity {
  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { nullable: true })
  parentId?: string;

  @Column('text', { nullable: true })
  note?: string;

  @Column('int', { default: 1 })
  revision!: number;
}
