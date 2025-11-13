import { GoalVo } from '@true-north/vo';

export type GoalFormData = Pick<GoalVo, 'name' | 'status' | 'importance' | 'type' | 'description' | 'difficulty'> & {
  id?: string;
  planTimeRange: [string | undefined, string | undefined];
  children?: GoalFormData[];
  parentId?: string;
};
