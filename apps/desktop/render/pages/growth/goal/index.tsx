'use client';

import { GoalProvider } from './context';
import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import clsx from 'clsx';
import { FlexibleContainer } from 'francis-component-react';
import { useGoalContext } from './context';
import { useGoalDetail } from '../components/GoalDetail';
import GoalMain from './GoalMain';
import GoalAside from './GoalAside';

const { Fixed, Shrink } = FlexibleContainer;

const { Sider, Content } = Layout;

interface GoalTreeViewProps {
  className?: string;
}

const GoalTreeView: React.FC<GoalTreeViewProps> = () => {
  const { refreshData } = useGoalContext();
  const { openCreateDrawer } = useGoalDetail();

  return (
    <Layout
      className={clsx('w-full h-full', 'rounded', 'bg-bg-2', 'overflow-hidden')}
    >
      {/* 左侧目标树 */}
      <Sider
        width={320}
        className={clsx('min-w-[200px] max-w-[400px]')}
        theme="light"
        resizeBoxProps={{
          directions: ['right'],
        }}
      >
        <GoalAside />
      </Sider>

      {/* 右侧详情面板 */}
      <Content>
        <GoalMain />
      </Content>
    </Layout>
  );
};

export default function Goal() {
  return (
    <GoalProvider>
      <GoalTreeView />
    </GoalProvider>
  );
}
