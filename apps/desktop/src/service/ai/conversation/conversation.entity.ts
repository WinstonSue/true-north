import 'reflect-metadata';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@true-north/plugin-sdk/main';
import type { PluginResourceAttachmentVo } from '@true-north/vo';

@Entity('ai_conversation')
export class AiConversation extends BaseEntity {
  @Column('varchar', { length: 255 })
  title!: string;

  @Column('simple-json', { nullable: true })
  attachments?: PluginResourceAttachmentVo[] | null;

  @Column('varchar', { length: 64, nullable: true })
  runtimeId?: string | null;

  @Column('varchar', { length: 128, nullable: true })
  runtimeThreadId?: string | null;

  @Column('boolean', { default: false })
  pinned!: boolean;

  @Column('varchar', { length: 16, nullable: true })
  purpose?: 'chat' | 'capture' | null;
}
