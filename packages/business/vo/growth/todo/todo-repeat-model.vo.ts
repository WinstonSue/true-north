import { BaseEntityVo } from '../../common';
import { TodoVo } from '../todo/todo-model.vo';
import { RepeatMode, RepeatEndMode, type RepeatConfigPayload } from '@true-north/components-repeat/types';
import { TodoStatus } from '@true-north/enum';

export type TodoRepeatWithoutRelationsVo = {
  repeatMode: RepeatMode;
  repeatConfig?: RepeatConfigPayload;
  repeatEndMode: RepeatEndMode;
  repeatEndDate?: string;
  repeatTimes?: number;
  repeatStartDate: string;
  currentDate: string;
  name: string;
  description?: string;
  importance?: number;
  urgency?: number;
  status: TodoStatus;
  abandonedAt?: string;
} & BaseEntityVo;

export type TodoRepeatVo = TodoRepeatWithoutRelationsVo & {
  todos?: TodoVo[];
};
