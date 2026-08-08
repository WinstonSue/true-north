import dayjs from 'dayjs';
import { BaseModelDto, BaseMapper } from '@business/common';
import { IntersectionType } from 'francis-mapped-types';
import { TodoRepeat, TodoRepeatWithoutRelations } from '../todo-repeat.entity';
import { Todo } from '../../todo/todo.entity';
import type { Todo as TodoVO } from '@true-north/vo';
import { TodoRelatedType } from '@true-north/enum';

function toHm(value?: string): string | undefined {
  if (!value) return undefined;
  const [hour, minute] = value.split(':');
  if (hour === undefined || minute === undefined) return undefined;
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

export class TodoRepeatWithoutRelationsDto extends TodoRepeatWithoutRelations {}

export class TodoRepeatDto extends IntersectionType(BaseModelDto, TodoRepeatWithoutRelationsDto) {
  todos?: Todo[];

  importEntity(entity: TodoRepeat) {
    Object.assign(this, BaseMapper.entityToDto(entity));
    // 重复配置相关字段
    this.repeatStartDate = entity.repeatStartDate;
    this.repeatMode = entity.repeatMode;
    this.repeatConfig = entity.repeatConfig;
    this.repeatEndMode = entity.repeatEndMode;
    this.repeatEndDate = entity.repeatEndDate;
    this.repeatTimes = entity.repeatTimes;
    this.name = entity.name;
    this.description = entity.description;
    this.importance = entity.importance;
    this.urgency = entity.urgency;
    this.currentDate = entity.currentDate;
    this.planStartTime = toHm(entity.planStartTime);
    this.planEndTime = toHm(entity.planEndTime);
    this.status = entity.status;
    this.abandonedAt = entity.abandonedAt;
    // 关联属性（浅拷贝，避免递归）
    this.todos = entity.todos;
  }

  exportVo(): TodoVO.TodoVo {
    return {
      id: this.id,
      // 重复配置相关字段
      name: this.name || '',
      description: this.description || '',
      importance: this.importance,
      urgency: this.urgency,
      status: this.status,
      abandonedAt: this.abandonedAt ? dayjs(this.abandonedAt).format('YYYY-MM-DD HH:mm:ss') : undefined,
      createdAt: dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      planDate: dayjs(this.currentDate).format('YYYY-MM-DD'),
      planStartTime: toHm(this.planStartTime),
      planEndTime: toHm(this.planEndTime),
      relatedType: TodoRelatedType.IS_REPEAT,
      settledTimes: this.todos?.length ?? 0,

      repeatConfig: {
        currentDate: dayjs(this.currentDate).format('YYYY-MM-DD'),
        repeatStartDate: dayjs(this.repeatStartDate).format('YYYY-MM-DD'),
        repeatMode: this.repeatMode,
        repeatConfig: this.repeatConfig,
        repeatEndMode: this.repeatEndMode,
        repeatEndDate: this.repeatEndDate,
        repeatTimes: this.repeatTimes,
      },
    };
  }
}
