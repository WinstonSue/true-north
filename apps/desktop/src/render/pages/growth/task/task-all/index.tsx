'use client';

import { TaskFilters } from './TaskFilters';
import { Flex } from '@sue/design-web-react';
import { TaskAllProvider } from './context';
import TaskTable from './TaskTable';
import { useTaskAllContext } from './context';
import { CreateButton } from '@/components/Button/CreateButton';
import { useTaskDetail } from '../../components';
import styles from './style.module.less';

function TaskAll() {
  const { getTaskPage } = useTaskAllContext();
  const { openCreateDrawer: openCreateTaskDrawer } = useTaskDetail();

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fixed" className={styles.filters}>
        <TaskFilters />
      </Flex>

      <Flex container="fixed" className={styles.actions}>
        <CreateButton
          onClick={() => {
            openCreateTaskDrawer({
              contentProps: {
                afterSubmit: async () => {
                  await getTaskPage();
                },
              },
            });
          }}
        >
          新建
        </CreateButton>
      </Flex>

      <Flex container="fill" className={styles.table}>
        <TaskTable />
      </Flex>
    </Flex>
  );
}

export default function TaskAllLayout() {
  return (
    <TaskAllProvider>
      <TaskAll></TaskAll>
    </TaskAllProvider>
  );
}
