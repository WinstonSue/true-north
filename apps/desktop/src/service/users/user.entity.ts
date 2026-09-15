import 'reflect-metadata';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

@Entity('user')
export class User extends BaseEntity {
  @Column('varchar', { length: 255 })
  username: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 255, nullable: true })
  name?: string;
}
