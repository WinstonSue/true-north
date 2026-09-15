import React, { useEffect, useState } from 'react';
import { Flex } from '@sue/design-web-react';
import { useGoalContext } from '../context';
import { GoalDetailProvider, GoalForeign } from '../../components/goal-detail';
import GoalMainHeader from './GoalMainHeader';
import GoalOverview from './GoalOverview';
import { DetailTabs, EmptyState, LoadingState } from '../../../ui';
import styles from './style.module.less';

const GoalDetail: React.FC = () => {
  const {
    selectedGoal,
    fetchGoalDetail,
    selectedGoalId,
    setSelectedGoalId,
  } = useGoalContext();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalDetail(selectedGoalId);
      setActiveTab('overview');
    }
  }, [selectedGoalId]);

  if (!selectedGoalId) {
    return <EmptyState description="请从左侧选择一个目标查看详情" />;
  }

  if (!selectedGoal) {
    return <LoadingState />;
  }

  return (
    <GoalDetailProvider
      key={`${selectedGoal.id}-${selectedGoal.updatedAt ?? ''}`}
      size="small"
      goalId={selectedGoal.id}
      readonly
    >
      <Flex vertical container="full" className={styles.detail}>
        <GoalMainHeader />
        <Flex vertical container="fill" className={styles.body}>
          <DetailTabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'overview',
                label: '概览',
                children: <GoalOverview />,
              },
              {
                key: 'children',
                label: '子目标',
                children: (
                  <GoalForeign
                    goalId={selectedGoal.id}
                    activeTab="children"
                    onChangeGoal={async (id) => {
                      setSelectedGoalId(id);
                    }}
                  />
                ),
              },
              {
                key: 'tasks',
                label: '关联任务',
                children: (
                  <GoalForeign
                    goalId={selectedGoal.id}
                    activeTab="taskList"
                  />
                ),
              },
            ]}
          />
        </Flex>
      </Flex>
    </GoalDetailProvider>
  );
};

export default GoalDetail;
