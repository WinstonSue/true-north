'use client';

import { GoalProvider } from './context';
import React from 'react';
import { Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { usePluginViewRuntime, usePluginViewState } from '@true-north/plugin-sdk/renderer';
import { goalViewCodec } from '../../../contract/view-state';
import GoalMain from './goal-main';
import GoalAside from './goal-aside';
import GoalMindMap from '../mind-map';
import { CompactViewNav, GrowthPage, SplitPane } from '../../ui';
import { growthIds } from '../../../contract';
import { growthNavigation, usesCompactNav } from '../../layout/nav';
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
  const children = growthNavigation.find((group) => group.view === 'goal')?.children || [];

  return (
    <GoalProvider>
      <GrowthPage
        compactNav={
          mode === 'workbench' && usesCompactNav(mode) ? (
            <CompactViewNav
              viewId={growthIds.views.goal}
              children={children}
              activeTab={state.tab}
              onSelect={(tab) => setState((prev) => ({ ...prev, tab: (tab as typeof prev.tab) || 'tree' }))}
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
