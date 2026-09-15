'use client';

import { GoalProvider } from './context';
import React, { useEffect, useState } from 'react';
import { Flex, Tabs } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { useWorkbenchViewRuntimeOptional } from '@true-north/plugin-sdk/renderer';
import GoalMain from './goal-main';
import GoalAside from './goal-aside';
import GoalMindMap from '../mind-map';
import styles from './style.module.less';

const GoalTreeView: React.FC = () => {
  return (
    <Flex container="full" className={styles.treeLayout}>
      <ProductSurface id={productRef('growth.goal.view.tree')}>
        <Flex container="fixed" className={styles.sider}>
          <GoalAside />
        </Flex>
      </ProductSurface>

      <ProductSurface id={productRef('growth.goal.view.detail')}>
        <Flex container="fill" className={styles.content}>
          <GoalMain />
        </Flex>
      </ProductSurface>
    </Flex>
  );
};

export default function Goal() {
  const viewRuntime = useWorkbenchViewRuntimeOptional();
  const [activeTab, setActiveTab] = useState('tree');

  useEffect(() => {
    if (viewRuntime?.target?.type === 'goal') setActiveTab('tree');
  }, [viewRuntime?.generation, viewRuntime?.target]);

  return (
    <GoalProvider>
      <Flex vertical container="full" className={styles.page}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.tabs}
          tabBarStyle={{ padding: '0 16px' }}
          items={[
            {
              key: 'tree',
              label: '目标树',
              children: <GoalTreeView />,
            },
            {
              key: 'mindmap',
              label: '目标脑图',
              children: (
                <ProductSurface id={productRef('growth.goal.view.mindmap')}>
                  <GoalMindMap />
                </ProductSurface>
              ),
            },
          ]}
        />
      </Flex>
    </GoalProvider>
  );
}
