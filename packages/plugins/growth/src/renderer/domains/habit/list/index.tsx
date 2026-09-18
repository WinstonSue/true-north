import React from 'react';
import { Button, Dropdown, Flex, Space } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { HOST_AI_START } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { ChevronDown, Plus } from 'lucide-react';
import { FilterBar, PageHeader } from '@true-north/plugin-ui';
import { drawerShellStyles, GrowthPage } from '../../../ui';
import { openGrowthDrawer } from '../../../runtime/drawer';
import { CreateHabit } from '../components/CreateHabit';
import HabitListFilter from './HabitListFilter';
import { HabitListProvider, useHabitListContext } from './context';
import HabitListTable from './HabitListTable';
import styles from './style.module.less';

export const HabitListPage: React.FC = () => {
  const { goals, handleRefresh } = useHabitListContext();
  const hostActions = useHostActions();
  const openCreateModal = () => {
    const instance = openGrowthDrawer({
      title: '新增习惯',
      size: 800,
      styles: drawerShellStyles,
      content: (
        <CreateHabit
          goals={goals}
          onSuccess={() => {
            handleRefresh();
            instance.destroy();
          }}
          onCancel={() => {
            instance.destroy();
          }}
        />
      ),
    });
  };

  return (
    <GrowthPage>
      <ProductSurface id={productRef('growth.habit.view.list')}>
        <Flex vertical container="full" className={styles.page}>
          <PageHeader
            extra={
              <Space.Compact>
                <Button type="primary" icon={<Plus size={14} />} onClick={openCreateModal}>
                  新增习惯
                </Button>
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      { key: 'manual', label: '手动创建', onClick: openCreateModal },
                      {
                        key: 'ai',
                        label: '使用 AI 创建',
                        onClick: () => {
                          void hostActions.invoke(HOST_AI_START, { message: '请帮我创建一个习惯' });
                        },
                      },
                    ],
                  }}
                >
                  <Button type="primary" aria-label="更多创建方式" icon={<ChevronDown size={14} />} />
                </Dropdown>
              </Space.Compact>
            }
          />
          <FilterBar>
            <HabitListFilter />
          </FilterBar>
          <Flex container="fill" className={styles.list}>
            <HabitListTable />
          </Flex>
        </Flex>
      </ProductSurface>
    </GrowthPage>
  );
};

export default () => {
  return (
    <HabitListProvider>
      <HabitListPage />
    </HabitListProvider>
  );
};
