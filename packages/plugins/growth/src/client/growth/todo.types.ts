import { TodoVo } from '@true-north/vo';

export type TodoFormData = {
  name: string;
  description?: string;
  status?: TodoVo['status'];
  importance?: number;
  urgency?: number;
  planDate: string;
  planTimeRange?: [string, string];
  repeatConfig?: TodoVo['repeatConfig'];
  relatedType?: TodoVo['relatedType'];
  relatedId?: string;
  repeatId?: string;
  taskId?: string;
  habitId?: string;
  settledTimes?: number;
  notifyRule?: TodoVo['notifyRule'];
  /** 完成时发起的已发布 Workflow；不写入待办实体 */
  workflowDefinitionId?: string | null;
};
