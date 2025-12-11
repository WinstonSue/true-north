'use client';

import { Outlet } from 'react-router-dom';
import { GoalProvider } from './context';
import TabsPage from '@/components/Layout/TabsPage';

export default function GoalPage() {
  return (
    <GoalProvider>
      <Outlet></Outlet>
    </GoalProvider>
  );
}
