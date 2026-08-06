'use client';

import { Outlet } from 'react-router-dom';
import TabsPage from '@/components/Layout/TabsPage';
import { CreateButton } from '@/components/Button/CreateButton';
import { useTodoDetail } from '../components';

export default function TodoPage() {
  const { openCreateDrawer } = useTodoDetail();

  return (
    <TabsPage
      extra={
        <CreateButton
          onClick={() => {
            openCreateDrawer({
              contentProps: {
              },
            });
          }}
        >
          新建待办
        </CreateButton>
      }
      tabs={[
        { name: '今日待办', path: '/growth/todo/todo-today' },
        { name: '待办日历', path: '/growth/todo/todo-calendar' },
        { name: '全部待办', path: '/growth/todo/todo-all' },
      ]}
    >
      <Outlet />
    </TabsPage>
  );
}
