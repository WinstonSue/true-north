'use client';

import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import { GoalTreeViewProvider } from './context';
import GoalTree from './GoalTree';
import GoalDetail from './GoalDetail';
import clsx from 'clsx';

const { Sider, Content } = Layout;

interface GoalTreeViewProps {
  className?: string;
}

const GoalTreeView: React.FC<GoalTreeViewProps> = () => {
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
        <GoalTree />
      </Sider>

      {/* 右侧详情面板 */}
      <Content>
        <GoalDetail />
      </Content>
    </Layout>
  );
};

export default function GoalTreeViewLayout(props: GoalTreeViewProps) {
  return (
    <GoalTreeViewProvider>
      <GoalTreeView {...props} />
    </GoalTreeViewProvider>
  );
}
