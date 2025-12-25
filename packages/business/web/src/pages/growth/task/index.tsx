'use client';

import { Outlet } from 'react-router-dom';
import TabsPage from '@/components/Layout/TabsPage';

export default function TaskPage() {
  return (
    <TabsPage
      tabs={[
        { name: '当前任务', path: '/growth/task/task-week' },
        { name: '任务日历', path: '/growth/task/task-calendar' },
        { name: '全部任务', path: '/growth/task/task-all' },
      ]}
    >
      <Outlet></Outlet>
    </TabsPage>
  );
}
