'use client';

import { GoalProvider } from './context';
import React from 'react';
import { Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { goalViewCodec } from '../../../contract/view-state';
import GoalMain from './main';
import GoalAside from './aside';
import GoalMindMap from './mind-map';
import { CompactViewNav } from '../../ui/CompactViewNav';
import { GrowthPage } from '../../ui/GrowthPage';
import { SplitPane } from '../../ui/SplitPane';
import { compactNavItems, usesCompactNav } from '../../shared/navigation';
import styles from './style.module.less';

const GoalTreeView: React.FC = () => {
  return (
    <SplitPane
      asideLabel="目标树"
      aside={
        <ProductSurface id={productRef('growth.goal.view.tree')}>
          <GoalAside />
        </ProductSurface>
      }
    >
      <ProductSurface id={productRef('growth.goal.view.detail')}>
        <Flex container="full" className={styles.content}>
          <GoalMain />
        </Flex>
      </ProductSurface>
    </SplitPane>
  );
};

export default function Goal() {
  const { mode } = usePluginViewRuntime();
  const [state, setState] = usePluginViewState(goalViewCodec);
  return (
    <GoalProvider>
      <GrowthPage
        compactNav={
          mode === 'workbench' && usesCompactNav(mode) ? (
            <CompactViewNav
              items={compactNavItems('goal')}
              activeKey={state.tab}
              onSelect={(tab) => setState((prev) => ({ ...prev, tab: tab as typeof prev.tab }))}
            />
          ) : null
        }
      >
        <Flex vertical container="full" className={styles.page}>
          {state.tab === 'mindmap' ? (
            <ProductSurface id={productRef('growth.goal.view.mindmap')}>
              <GoalMindMap />
            </ProductSurface>
          ) : (
            <GoalTreeView />
          )}
        </Flex>
      </GrowthPage>
    </GoalProvider>
  );
}
