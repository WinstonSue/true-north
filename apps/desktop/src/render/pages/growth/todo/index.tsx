'use client';

import { Outlet } from 'react-router-dom';
import TabsPage from '@/components/Layout/TabsPage';

export default function TodoPage() {
  // const [activeKey, setActiveKey] = useState('tab-1');

  // const handleTabClick = (id: string) => {
  //   setActiveKey(id);
  // };

  // const handleTabDrop = (id: string, index?: number) => {
  //   console.log('Tab dropped:', id, 'at index:', index);
  //   // 这里可以添加处理拖拽后的逻辑
  // };

  return (
    <TabsPage
      tabs={[
        { name: '今日待办', path: '/growth/todo/todo-today' },
        { name: '本周待办', path: '/growth/todo/todo-week' },
        { name: '待办日历', path: '/growth/todo/todo-calendar' },
        { name: '全部待办', path: '/growth/todo/todo-all' },
        { name: '待办统计', path: '/growth/todo/todo-dashboard' },
      ]}
    >
      <Outlet></Outlet>
    </TabsPage>
  );
}
