'use client';

import { TodoFilters } from './TodoFilters';
import { Flex } from '@sue/design-web-react';
import { TodoAllProvider } from './context';
import TodoTable from './TodoTable';
import { useTodoDetail } from '../../components';
import { useTodoAllContext } from './context';
import { CreateButton } from '@/components/Button/CreateButton';

function TodoAll() {
  const { getTodoPage } = useTodoAllContext();
  const { CreatePopover: CreateTodoPopover } = useTodoDetail();

  return (
    <>
      <Flex container="fixed" className="w-full px-5 flex border-b">
        <TodoFilters />
      </Flex>

      <Flex container="fixed" className="w-full px-5 flex my-3">
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

      <Flex container="fill" className="px-5 w-full h-full flex">
        <TodoTable />
      </Flex>
    </>
  );
}

export default function TodoAllLayout() {
  return (
    <TodoAllProvider>
      <TodoAll></TodoAll>
    </TodoAllProvider>
  );
}
