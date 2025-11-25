'use client';

import { GoalFilters } from './GoalFilters';
import { FlexibleContainer } from 'francis-component-react';
import { GoalAllProvider } from './context';
import GoalTable from './GoalTable';
import { useGoalAllContext } from './context';
import { CreateButton } from '@/components/Button/CreateButton';
import { useGoalDetail } from '../../components/GoalDetail';

function GoalAll() {
  const { getGoalPage } = useGoalAllContext();
  const { openCreateDrawer } = useGoalDetail();

  return (
    <FlexibleContainer className="bg-bg-2 rounded-lg gap-3">
      <FlexibleContainer.Fixed className="flex border-b">
        <GoalFilters />
      </FlexibleContainer.Fixed>

      <FlexibleContainer.Fixed className="flex">
        <CreateButton
          onClick={() =>
            openCreateDrawer({
              contentProps: {
                afterSubmit: async () => {
                  getGoalPage();
                },
              },
            })
          }
        >
          新建
        </CreateButton>
      </FlexibleContainer.Fixed>

      <FlexibleContainer.Shrink>
        <GoalTable />
      </FlexibleContainer.Shrink>
    </FlexibleContainer>
  );
}

export default function GoalAllLayout() {
  return (
    <GoalAllProvider>
      <GoalAll></GoalAll>
    </GoalAllProvider>
  );
}
