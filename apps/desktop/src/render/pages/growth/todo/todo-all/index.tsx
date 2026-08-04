'use client';

import { TodoFilters } from './TodoFilters';
import { Flex } from '@sue/design-web-react';
import { TodoAllProvider } from './context';
import TodoTable from './TodoTable';
import { useTodoDetail } from '../../components';
import { useTodoAllContext } from './context';
import { CreateButton } from '@/components/Button/CreateButton';
import styles from './style.module.less';

function TodoAll() {
  const { getTodoPage } = useTodoAllContext();
  const { CreatePopover: CreateTodoPopover } = useTodoDetail();

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fixed" className={styles.filters}>
        <TodoFilters />
      </Flex>

      <Flex container="fixed" className={styles.actions}>
        <CreateTodoPopover
          creatorProps={{
            showSubmitButton: true,
            afterSubmit: async () => {
              getTodoPage();
            },
          }}
        >
          <CreateButton>新建</CreateButton>
        </CreateTodoPopover>
      </Flex>

      <Flex container="fill" className={styles.table}>
        <TodoTable />
      </Flex>
    </Flex>
  );
}

export default function TodoAllLayout() {
  return (
    <TodoAllProvider>
      <TodoAll></TodoAll>
    </TodoAllProvider>
  );
}
