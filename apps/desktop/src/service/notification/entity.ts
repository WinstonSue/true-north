import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';
import { HostNotificationMute } from './mute';

@Entity('host_notification')
@Index('host_notification_unread_dedupe', ['dedupeKey', 'readAt'])
export class HostNotification extends BaseEntity {
  @Column('varchar')
  title!: string;

  @Column('text', { nullable: true })
  body?: string;

  @Column('varchar', { nullable: true })
  href?: string;

  @Column('varchar', { nullable: true })
  uri?: string;

  @Column('varchar', { nullable: true })
  hostAction?: string;

  @Column('varchar', { nullable: true })
  pluginId?: string;

  @Column('varchar', { nullable: true })
  dedupeKey?: string;

  @Column('datetime', { nullable: true })
  readAt?: Date;
}

export const notificationEntities = [HostNotification, HostNotificationMute];
