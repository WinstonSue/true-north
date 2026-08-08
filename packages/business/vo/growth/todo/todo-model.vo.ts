import { BaseEntityVo } from '../../common';
import { TaskVo } from '../task/task-model.vo';
import { TodoRepeatVo } from './todo-repeat-model.vo';
import { TodoRelatedType, TodoStatus } from '@true-north/enum';
import { HabitVo } from '../habit/habit-model.vo';

export type TodoWithoutRelationsVo = {
  name: string;
  status: TodoStatus;
  description?: string;
  importance?: number;
  urgency?: number;
  doneAt?: string;
  abandonedAt?: string;
  planStartTime?: string;
  planEndTime?: string;
  planDate: string;
  relatedType: TodoRelatedType;
  taskId?: string;
  repeatId?: string;
  habitId?: string;
} & BaseEntityVo;

export type TodoVo = TodoWithoutRelationsVo & {
  repeatConfig?: {
    currentDate: TodoRepeatVo['currentDate'];
    repeatStartDate: TodoRepeatVo['repeatStartDate'];
    repeatMode: TodoRepeatVo['repeatMode'];
    repeatConfig: TodoRepeatVo['repeatConfig'];
    repeatEndMode: TodoRepeatVo['repeatEndMode'];
    repeatEndDate: TodoRepeatVo['repeatEndDate'];
    repeatTimes: TodoRepeatVo['repeatTimes'];
  };
  /** 周期模板已结算实例数；编辑时用于判断是否锁定当前计划日期 */
  settledTimes?: number;
  task?: TaskVo;
  habit?: HabitVo;
  repeat?: TodoRepeatVo;
};
