import 'reflect-metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

@Entity('inventory_item')
export class InventoryItem extends BaseEntity {
  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 64, nullable: true })
  category?: string;

  @Column('varchar', { length: 32, default: '个' })
  unit!: string;

  @Column('real', { nullable: true })
  minStock?: number;

  @Column('real', { nullable: true })
  targetStock?: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column('boolean', { default: false })
  archived!: boolean;

  @Column('int', { default: 1 })
  revision!: number;
}
