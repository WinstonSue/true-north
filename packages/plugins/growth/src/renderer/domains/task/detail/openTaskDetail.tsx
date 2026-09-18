import { openGrowthDrawer } from '../../../runtime/drawer';
import { TaskDetailPane } from './TaskDrawer';

type OpenTaskDetailOptions = {
  taskId: string;
  onRefresh?: () => Promise<void> | void;
};

export function openTaskDetailDrawer({ taskId, onRefresh }: OpenTaskDetailOptions) {
  let instance: ReturnType<typeof openGrowthDrawer>;
  instance = openGrowthDrawer({
    title: '任务详情',
    size: 1100,
    content: (
      <TaskDetailPane taskId={taskId} onClose={() => instance.destroy()} onRefresh={onRefresh} />
    ),
  });
  return instance;
}
