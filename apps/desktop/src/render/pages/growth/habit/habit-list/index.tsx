import React from 'react';
import DefaultPage from '@/components/Layout/DefaultPage';
import HabitListFilter from './HabitListFilter';
import { HabitListProvider, useHabitListContext } from './context';
import HabitListTable from './HabitListTable';
import { Button, Flex } from '@sue/design-web-react';
import { IconPlus } from '@true-north/components-ui';
import { openDrawer } from '@/layout/Drawer';
import { CreateHabit } from '../components/CreateHabit';

export const HabitListPage: React.FC = () => {
  const { goals, handleRefresh } = useHabitListContext();
  const openCreateHabitModal = () => {
    openDrawer({
      title: '新增习惯',
      content: () => (
        <CreateHabit
          goals={goals}
          onSuccess={() => {
            handleRefresh();
          }}
          onCancel={() => {}}
        />
      ),
      width: 800,
      height: 600,
    });
  };

  return (
    <DefaultPage title="习惯管理">
      <Flex vertical container="full">
        <Flex container="fixed">
          <HabitListFilter />
        </Flex>
        <Flex container="fixed">
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => {
              openCreateHabitModal();
            }}
          >
            新增习惯
          </Button>
        </Flex>
        <Flex container="fill">
          <HabitListTable />
        </Flex>
      </Flex>
    </DefaultPage>
  );
};

export default () => {
  return (
    <HabitListProvider>
      <HabitListPage />
    </HabitListProvider>
  );
};
