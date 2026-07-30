import React from 'react';
import DefaultPage from '@/components/Layout/DefaultPage';
import HabitListFilter from './HabitListFilter';
import { HabitListProvider, useHabitListContext } from './context';
import HabitListTable from './HabitListTable';
import { Button, Drawer, Flex, PlusOutlined } from '@sue/design-web-react';

import { CreateHabit } from '../components/CreateHabit';

export const HabitListPage: React.FC = () => {
  const { goals, handleRefresh } = useHabitListContext();
  const openCreateHabitModal = () => {
    const instance = Drawer.open({
      title: '新增习惯',
      size: 800,
      content: (
        <CreateHabit
          goals={goals}
          onSuccess={() => {
            handleRefresh();
            instance.destroy();
          }}
          onCancel={() => {
            instance.destroy();
          }}
        />
      ),
    });
  };

  return (
    <DefaultPage title="习惯管理">
      <Flex vertical container="full">
        <Flex container="fixed" className="w-full">
          <HabitListFilter />
        </Flex>
        <Flex container="fixed" className="w-full">
          <Button
            type="primary"
            icon={<PlusOutlined />}
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
