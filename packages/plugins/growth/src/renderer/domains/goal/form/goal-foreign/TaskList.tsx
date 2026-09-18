import { Button, Empty } from '@sue/design-web-react';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { openTaskDetailDrawer } from '../../../task/detail/openTaskDetail';
import { useGoalDetailContext } from '../context';
import { useTaskDetail } from '../../../task/form';
import TaskList from '../../../task/list';

export function GoalTaskList() {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();
  // 在当前页面打开任务详情抽屉
  const handleTaskClick = async (taskId: string) => {
    openTaskDetailDrawer({ taskId });
  };

  return currentGoal.taskList?.length > 0 ? (
    <TaskList
      taskList={currentGoal.taskList}
      onClickTask={handleTaskClick}
      refreshTaskList={async () => {
        await refreshGoalDetail(currentGoal.id);
      }}
    />
  ) : (
    <div
      className={clsx(['w-full h-full', 'flex items-center justify-center'])}
    >
      <Empty description="暂无任务" />
    </div>
  );
}

export function CreateTask() {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();
  const { CreatePopover: CreateTaskPopover } = useTaskDetail();

  return (
    <div
      className={clsx([
        'text-title-1 text-text-1 font-medium',
        'flex justify-between items-center',
      ])}
    >
      <CreateTaskPopover
        creatorProps={{
          initialFormData: {
            goalId: currentGoal.id,
            planTimeRange: [currentGoal.startAt, currentGoal.endAt],
          },
          afterSubmit: async () => {
            await refreshGoalDetail(currentGoal.id);
          },
        }}
      >
        <Button className="!px-2" type="text" size="small" icon={<Plus size={14} />}>
          添加任务
        </Button>
      </CreateTaskPopover>
    </div>
  );
}
