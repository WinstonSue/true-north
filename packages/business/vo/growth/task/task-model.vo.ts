import { BaseEntityVo } from '../../common';
import { TrackTimeVo } from '../track-time/track-time.vo';
import { GoalVo } from '../goal/goal-model.vo';
import { TodoVo } from '../todo/todo-model.vo';
import { TaskStatus, Difficulty } from '@true-north/enum';
import type { TaskNotifyRule } from '../notify-rule';

export type TaskWithoutRelationsVo = {
  name: string;
  status: TaskStatus;
  estimateTime?: number;
  trackTimeIds: string[];
  description?: string;
  importance?: number;
  difficulty?: Difficulty;
  urgency?: number;
  tags: string[];
  doneAt?: string;
  abandonedAt?: string;
  startAt?: string;
  endAt?: string;
  parentId?: string;
  goalId?: string;
  notifyRule?: TaskNotifyRule | null;
} & BaseEntityVo;

export type TaskVo = TaskWithoutRelationsVo & {
  children?: TaskVo[];
  parent?: TaskVo;
  goal?: GoalVo;
  trackTimeList?: TrackTimeVo[];
  todoList?: TodoVo[];
};