import { FlexibleContainer } from 'francis-component-react';
import {
  GoalDetailProvider,
  GoalDetailContextProps,
  useGoalDetailContext,
} from './context';
import GoalForm from './GoalForm';
import { Button, Spin } from '@arco-design/web-react';
import { GoalTaskList, CreateTask } from './TaskList';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { GoalService, GoalMapping } from '@true-north/web-service';
import { CreateGoal, GoalChildren } from './GoalChildren';

const { Shrink, Fixed } = FlexibleContainer;

export type GoalEditorProps = {
  goalId: string;
  size?: GoalDetailContextProps['size'];
  onClose?: () => Promise<void>;
  afterSubmit?: GoalDetailContextProps['afterSubmit'];
};

export default function GoalEditor(props: GoalEditorProps) {
  return (
    <GoalDetailProvider
      size={props.size}
      goalId={props.goalId}
      onClose={props.onClose}
      afterSubmit={props.afterSubmit}
    >
      <GoalEditorMain goalId={props.goalId} />
    </GoalDetailProvider>
  );
}

function GoalEditorMain(props: { goalId: string }) {
  const [loading, setLoading] = useState(false);
  const { goalId } = props;
  const { refreshGoalDetail } = useGoalDetailContext();

  useEffect(() => {
    async function init() {
      setLoading(true);
      await refreshGoalDetail(goalId);
      setLoading(false);
    }
    init();
  }, [refreshGoalDetail, goalId]);

  const [activeTab, setActiveTab] = useState<'children' | 'taskList'>(
    'children',
  );
  const tabs = [
    {
      label: '子目标',
      value: 'children',
    },
    {
      label: '任务列表',
      value: 'taskList',
    },
  ] as const;

  if (loading) {
    return <Spin dot />;
  }

  return (
    <FlexibleContainer className="gap-2">
      <Fixed>
        <GoalForm />
      </Fixed>
      <Fixed className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {tabs.map((item) => (
            <div
              key={item.value}
              className={clsx(
                'px-3 py-2',
                'rounded-lg',
                'font-[500]',
                'cursor-pointer',
                'hover:bg-gray-100',
                activeTab === item.value
                  ? ['bg-gray-100', 'text-text-1']
                  : ['text-text-2'],
              )}
              onClick={() => {
                setActiveTab(item.value);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div
          className={clsx([
            'text-title-1 text-text-1 font-medium p-2',
            'flex justify-between items-center',
          ])}
        >
          {activeTab === 'children' && <CreateGoal />}
          {activeTab === 'taskList' && <CreateTask />}
        </div>
      </Fixed>
      <Shrink>
        {activeTab === 'children' && <GoalChildren />}
        {activeTab === 'taskList' && <GoalTaskList />}
      </Shrink>
      <Fixed>
        <GoalEditorFooter />
      </Fixed>
    </FlexibleContainer>
  );
}

function GoalEditorFooter() {
  const { onSubmit, onClose, currentGoal, goalFormData } =
    useGoalDetailContext();

  async function handleUpdate() {
    await GoalService.update(
      currentGoal.id,
      GoalMapping.formDataToUpdateVo(goalFormData),
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={() => onClose?.()}>取消</Button>
      <Button
        type="primary"
        onClick={async () => {
          await handleUpdate();
          await onSubmit();
          onClose?.();
        }}
      >
        确认
      </Button>
    </div>
  );
}
