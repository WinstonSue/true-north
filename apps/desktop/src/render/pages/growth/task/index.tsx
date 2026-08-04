'use client';

import { Outlet } from 'react-router-dom';
import TabsPage from '@/components/Layout/TabsPage';

export default function TaskPage() {
  return (
    <TabsPage
      tabs={[
        { name: '今日任务', path: '/growth/task/task-today' },
        { name: '本周任务', path: '/growth/task/task-week' },
        { name: '任务日历', path: '/growth/task/task-calendar' },
        { name: '全部任务', path: '/growth/task/task-all' },
        { name: '任务统计', path: '/growth/task/task-statistics' },
      ]}
    >
      <Outlet></Outlet>
    </TabsPage>
  );
}
