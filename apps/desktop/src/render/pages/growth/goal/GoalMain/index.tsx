import React, { useEffect, useState } from 'react';
import { FlexibleContainer } from '@true-north/components-ui';
import { Empty, Spin, Divider } from '@sue/design-web-react';
import { useGoalContext } from '../context';
import {
  GoalDetailProvider,
  GoalForm,
  GoalForeign,
} from '../../components/GoalDetail';
import GoalMainHeader from './GoalMainHeader';
import clsx from 'clsx';

const { Fixed, Shrink } = FlexibleContainer;

const GoalDetail: React.FC = () => {
  const {
    selectedGoal,
    fetchGoalDetail,
    refreshData,
    selectedGoalId,
    setSelectedGoalId,
    isEditing,
    setIsEditing,
  } = useGoalContext();

  // 当选中的目标ID变化时，获取详情
  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalDetail(selectedGoalId);
      setIsEditing(false); // 切换目标时退出编辑模式
    }
  }, [selectedGoalId]);

  // 编辑完成后的回调
  const handleEditComplete = async () => {
    setIsEditing(false);
    await refreshData();
  };

  if (!selectedGoalId) {
    return (
      <div
        className={clsx('w-full h-full', 'flex items-center justify-center')}
      >
        <Empty description="请从左侧选择一个目标查看详情" />
      </div>
    );
  }

  if (!selectedGoal) {
    return (
      <div
        className={clsx('w-full h-full', 'flex items-center justify-center')}
      >
        <Spin size={40} />
      </div>
    );
  }

  return (
    <GoalDetailProvider
      size="small"
      goalId={selectedGoal.id}
      readonly={!isEditing}
      onClose={handleEditComplete}
      afterSubmit={handleEditComplete}
    >
      <FlexibleContainer>
        <GoalMainHeader />
        <Shrink className={clsx('flex flex-col gap-4 p-4 overflow-auto')}>
          <GoalForm />
          <Divider className="!m-0" />
          <GoalForeign
            goalId={selectedGoal.id}
            onChangeGoal={async (id) => {
              setSelectedGoalId(id);
            }}
          />
        </Shrink>
      </FlexibleContainer>
    </GoalDetailProvider>
  );
};

export default GoalDetail;
