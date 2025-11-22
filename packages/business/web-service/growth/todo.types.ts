import { TodoVo } from '@true-north/vo';

export type TodoFormData = {
  name: string;
  description?: string;
  status?: TodoVo['status'];
  tags?: string[];
  importance?: number;
  urgency?: number;
  planDate: string;
  planTimeRange?: [string, string];
  repeatConfig?: TodoVo['repeatConfig'];
  relatedType?: TodoVo['relatedType'];
  repeatId?: string;
  taskId?: string;
  habitId?: string;
};
