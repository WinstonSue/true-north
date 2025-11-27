import { BaseEntity } from '@business/common';
import { TrackTimeRelatedType } from '@true-north/enum';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from '../task';

@Entity('track_time')
export class TrackTime extends BaseEntity {
  startAt!: Date;

  endAt!: Date;

  notes?: string;

  /** 关联类型 */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  relatedType!: TrackTimeRelatedType;

  /** 关联ID */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  relatedId!: string;

  /** 重复配置 */
  @ManyToOne(() => Task)
  @JoinColumn({ name: 'related_id' })
  task?: Task;
}
