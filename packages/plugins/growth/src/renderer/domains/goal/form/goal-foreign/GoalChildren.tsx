import clsx from 'clsx';
import { Button, Empty } from '@sue/design-web-react';
import { Plus } from 'lucide-react';
import { useGoalDetailContext } from '../context';
import GoalList from '../../list';
import { useGoalDetail } from '..';

export function GoalChildren(props: {
  onChangeGoal?: (id: string) => Promise<void>;
}) {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();

  return currentGoal?.children?.length > 0 ? (
    <GoalList
      goalList={currentGoal.children}
      onClickGoal={async (id) => {
        await refreshGoalDetail(id);
        props.onChangeGoal?.(id);
      }}
      refreshGoalList={async () => {
        await refreshGoalDetail(currentGoal.id);
      }}
    />
  ) : (
    <div
      className={clsx(['w-full h-full', 'flex items-center justify-center'])}
    >
      <Empty description="暂无子目标" />
    </div>
  );
}

export function CreateGoal() {
  const { currentGoal, refreshGoalDetail } = useGoalDetailContext();
  const { CreatePopover: CreateGoalPopover } = useGoalDetail();

  return currentGoal ? (
    <div
      className={clsx([
        'text-title-1 text-text-1 font-medium',
        'flex justify-between items-center',
      ])}
    >
      <CreateGoalPopover
        creatorProps={{
          initialFormData: {
            parentId: currentGoal?.id,
          },
          afterSubmit: async () => {
            await refreshGoalDetail(currentGoal?.id);
          },
        }}
      >
        <Button className="!px-2" type="text" size="small" icon={<Plus size={14} />}>
          添加子目标
        </Button>
      </CreateGoalPopover>
    </div>
  ) : null;
}
