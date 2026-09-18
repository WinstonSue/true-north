'use client';

import { useEffect } from 'react';
import { FilterBar } from '@true-north/plugin-ui';
import { TaskFilters } from './TaskFilters';
import { Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { TaskAllProvider } from './context';
import TaskTable from './TaskTable';
import { useTaskAllContext } from './context';
import styles from './style.module.less';
import { onTaskChanged } from '../../../shared/events';

function TaskAll() {
  const { getTaskPage } = useTaskAllContext();
  useEffect(() => {
    void getTaskPage();
    return onTaskChanged(() => { void getTaskPage(); });
  }, []);

  return (
    <ProductSurface id={productRef('growth.task.view.all')}>
    <Flex vertical container="full" className={styles.page}>
      <FilterBar>
        <TaskFilters />
      </FilterBar>

      <Flex container="fill" className={styles.table}>
        <TaskTable />
      </Flex>
    </Flex>
    </ProductSurface>
  );
}

export default function TaskAllLayout() {
  return (
    <TaskAllProvider>
      <TaskAll></TaskAll>
    </TaskAllProvider>
  );
}
