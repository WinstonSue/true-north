import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';

@Entity('host_notification_mute')
@Index('host_notification_mute_dedupe', ['dedupeKey'], { unique: true })
export class HostNotificationMute extends BaseEntity {
  @Column('varchar')
  dedupeKey!: string;

  @Column('datetime')
  mutedAt!: Date;
}
