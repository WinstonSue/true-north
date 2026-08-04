'use client';

import { GoalProvider } from './context';
import React, { useState } from 'react';
import { Layout, Tabs } from '@sue/design-web-react';
import { useGoalContext } from './context';
import { useGoalDetail } from '../components/GoalDetail';
import GoalMain from './GoalMain';
import GoalAside from './GoalAside';
import GoalMindMap from '@/pages/mind-map';
import styles from './style.module.less';

const { Sider, Content } = Layout;

interface GoalTreeViewProps {
  className?: string;
}

const GoalTreeView: React.FC<GoalTreeViewProps> = () => {
  const { refreshData } = useGoalContext();
  const { openCreateDrawer } = useGoalDetail();

  return (
    <Layout
      className={styles.treeLayout}
    >
      {/* 左侧目标树 */}
      <Sider
        width={320}
        className={styles.sider}
        theme="light"
      >
        <GoalAside />
      </Sider>

      {/* 右侧详情面板 */}
      <Content className={styles.content}>
        <GoalMain />
      </Content>
    </Layout>
  );
};

export default function Goal() {
  const [activeTab, setActiveTab] = useState('tree');

  return (
    <div className={styles.page}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={styles.tabs}
        items={[
          {
            key: 'tree',
            label: '目标树',
            children: (
              <div className={styles.tabContent}>
                <GoalProvider>
                  <GoalTreeView />
                </GoalProvider>
              </div>
            ),
          },
          {
            key: 'mindmap',
            label: '目标脑图',
            children: <GoalMindMap className={styles.tabContent} />,
          },
        ]}
      />
    </div>
  );
}
