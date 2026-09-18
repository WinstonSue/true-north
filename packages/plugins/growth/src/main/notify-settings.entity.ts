import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';
import type { GrowthNotifySettings } from '@true-north/vo';

@Entity('growth_notify_settings')
export class GrowthNotifySettingsEntity extends BaseEntity {
  @Column('simple-json')
  payload!: GrowthNotifySettings;
}

@Entity('growth_notify_fire')
export class GrowthNotifyFire extends BaseEntity {
  @Column('varchar')
  kind!: string;

  @Column('varchar')
  entityId!: string;

  @Column('varchar')
  slotDate!: string;

  @Column('varchar')
  slotHm!: string;
}
