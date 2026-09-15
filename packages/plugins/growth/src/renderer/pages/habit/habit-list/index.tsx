import React from 'react';
import { Button, Drawer, Flex } from '@sue/design-web-react';
import { Plus } from 'lucide-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { drawerShellStyles, FilterBar, GrowthPage, PageHeader } from '../../../ui';
import { CreateHabit } from '../components/CreateHabit';
import HabitListFilter from './HabitListFilter';
import { HabitListProvider, useHabitListContext } from './context';
import HabitListTable from './HabitListTable';
import styles from './style.module.less';

export const HabitListPage: React.FC = () => {
  const { goals, handleRefresh } = useHabitListContext();
  const openCreateModal = () => {
    const instance = Drawer.open({
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
              <Button type="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
                新增习惯
              </Button>
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
