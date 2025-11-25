import { useGoalDetailContext } from './context';
import clsx from 'clsx';
import { CreateButton } from '@/components/Button/CreateButton';
import { useTaskDetail } from '..';
import TaskList from '../TaskList';

export function GoalTaskList() {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();

  return (
    currentGoal?.taskList && (
      <TaskList
        taskList={currentGoal.taskList}
        onClickTask={async (id) => {}}
        refreshTaskList={async () => {
          await refreshGoalDetail(currentGoal.id);
        }}
      />
    )
  );
}

export function CreateTask() {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();
  const { CreatePopover: CreateTaskPopover } = useTaskDetail();

  return (
    <div
      className={clsx([
        'text-title-1 text-text-1 font-medium p-2',
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
        <CreateButton className="!px-2" type="text" size="small">
          添加任务
        </CreateButton>
      </CreateTaskPopover>
    </div>
  );
}
