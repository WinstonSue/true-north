import { TodoVo, TodoWithoutRelationsVo } from './todo-model.vo';
import { BaseFilterVo } from '../../common';
import { TodoRelatedType } from '@true-north/enum';

export type TodoFilterVo = {
  planDateStart?: string;
  planDateEnd?: string;
  doneDateStart?: string;
  doneDateEnd?: string;
  abandonedDateStart?: string;
  abandonedDateEnd?: string;
  taskIds?: string[];
  todoWithRepeatList?: { id: string; relatedType: TodoRelatedType }[];
} & BaseFilterVo &
  Partial<Pick<TodoVo, 'importance' | 'urgency' | 'status' | 'taskId' | 'relatedType'>>;

export type TodoPageFilterVo = TodoFilterVo & {
  pageNum: number;
  pageSize: number;
};
