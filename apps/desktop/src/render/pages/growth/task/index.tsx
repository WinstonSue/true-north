'use client';

import { Outlet } from 'react-router-dom';
import dayjs from 'dayjs';
import TabsPage from '@/components/Layout/TabsPage';
import { CreateButton } from '@/components/Button/CreateButton';
import { useTaskDetail } from '../components';

export default function TaskPage() {
  const { openCreateDrawer } = useTaskDetail();

  return (
    <TabsPage
      tabs={[
        { name: '今日任务', path: '/growth/task/task-today' },
        { name: '本周任务', path: '/growth/task/task-week' },
        { name: '任务日历', path: '/growth/task/task-calendar' },
        { name: '全部任务', path: '/growth/task/task-all' },
      ]}
      extra={
        <CreateButton
          onClick={() => {
            openCreateDrawer({
              contentProps: {
                initialFormData: {
                  planTimeRange: [dayjs().startOf('day'), dayjs().endOf('day')],
                },
              },
            });
          }}
        >
          新建任务
        </CreateButton>
      }
    >
      <Outlet />
    </TabsPage>
  );
}
