'use client';

import { TaskFilters } from './TaskFilters';
import { Flex } from '@sue/design-web-react';
import { TaskAllProvider } from './context';
import TaskTable from './TaskTable';
import { useTaskAllContext } from './context';
import { CreateButton } from '@/components/Button/CreateButton';
import { useTaskDetail } from '../../components';

function TaskAll() {
  const { getTaskPage } = useTaskAllContext();
  const { openCreateDrawer: openCreateTaskDrawer } = useTaskDetail();

  return (
    <Flex vertical container="full">
      <Flex container="fixed" className="w-full px-5 flex border-b">
        <TaskFilters />
      </Flex>

      <Flex container="fixed" className="w-full px-5 flex my-3">
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

      <Flex container="fill" className="px-5 w-full h-full flex">
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
