import { BaseEntityVo } from '../../common';
import { TaskVo } from '../task/task-model.vo';
import { GoalType, GoalStatus, Importance, Difficulty } from '@true-north/enum';

export type GoalWithoutRelationsVo = {
  name: string;
  type: GoalType;
  status: GoalStatus;
  importance: Importance;
  difficulty?: Difficulty;
  startAt?: string;
  endAt?: string;
  description?: string;
  doneAt?: string;
  abandonedAt?: string;
  parentId?: string;
} & BaseEntityVo;

export type GoalVo = GoalWithoutRelationsVo & {
  children?: GoalVo[];
  parent?: GoalVo;
  taskList?: TaskVo[];
  hasChildren?: boolean; // 标记是否有子节点，用于异步加载
};
