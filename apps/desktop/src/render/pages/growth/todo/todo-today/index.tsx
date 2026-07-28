import { TodoList, TodoCreatorMini, TodoEditor } from '../../components';
import { useEffect, useState } from 'react';
import { Collapse, Divider, Flex } from '@sue/design-web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { TodoVo, TodoWithoutRelationsVo } from '@true-north/vo';
import { flushSync } from 'react-dom';
import clsx from 'clsx';
import { useTodoHooks } from '../hooks';
import { TodoStatus } from '@true-north/enum';

export default function TodoToday() {
  const { today, yesterday } = useTodoHooks();
  const [todayTodoList, setTodayTodoList] = useState<TodoVo[]>([]);
  const [todayDoneTodoList, setTodayDoneTodoList] = useState<TodoVo[]>([]);
  const [expiredTodoList, setExpiredTodoList] = useState<TodoVo[]>([]);
  const [todayAbandonedTodoList, setTodayAbandonedTodoList] = useState<
    TodoVo[]
  >([]);

  async function refreshData() {
    const { list: todos } = await TodoService.list({
      status: TodoStatus.TODO,
      planDateStart: today,
      planDateEnd: today,
    });
    setTodayTodoList(todos);

    const { list: doneTodos } = await TodoService.list({
      status: TodoStatus.DONE,
      doneDateStart: today,
      doneDateEnd: today,
    });
    setTodayDoneTodoList(doneTodos);

    const { list: expiredTodos } = await TodoService.list({
      status: TodoStatus.TODO,
      planDateEnd: yesterday,
    });
    setExpiredTodoList(expiredTodos);

    const { list: abandonedTodos } = await TodoService.list({
      status: TodoStatus.ABANDONED,
      abandonedDateStart: today,
      abandonedDateEnd: today,
    });
    setTodayAbandonedTodoList(abandonedTodos);

    if (currentTodo) {
      showTodoDetail(currentTodo);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  const [currentTodo, setCurrentTodo] = useState<TodoVo | null>(null);

  async function showTodoDetail(_todo: TodoWithoutRelationsVo) {
    flushSync(() => {
      setCurrentTodo(null);
    });
    setCurrentTodo(_todo);
  }

  return (
    <Flex container="fill" className="flex">
      <Flex vertical container="fill" className="py-2">
        <Flex container="fixed" className="w-full">
          <TodoCreatorMini
            afterSubmit={async () => {
              refreshData();
            }}
          />
        </Flex>
        <Flex container="fill" className="overflow-y-auto">
          <Collapse
            defaultActiveKey={['expired', 'today']}
            className={clsx(styles['custom-collapse'])}
            bordered={false}
          >
            {expiredTodoList.length > 0 && (
              <Collapse.Panel header="已过期" key="expired">
                <TodoList
                  todoList={expiredTodoList}
                  onClickTodo={async (todo) => {
                    await showTodoDetail(todo);
                  }}
                  refreshTodoList={async () => {
                    await refreshData();
                  }}
                />
              </Collapse.Panel>
            )}
            {todayTodoList.length > 0 && (
              <Collapse.Panel header="今天" key="today">
                <TodoList
                  todoList={todayTodoList}
                  onClickTodo={async (todo) => {
                    await showTodoDetail(todo);
                  }}
                  refreshTodoList={async () => {
                    await refreshData();
                  }}
                />
              </Collapse.Panel>
            )}
            {todayDoneTodoList.length > 0 && (
              <Collapse.Panel header="已完成" key="done">
                <TodoList
                  todoList={todayDoneTodoList}
                  onClickTodo={async (todo) => {
                    await showTodoDetail(todo);
                  }}
                  refreshTodoList={async () => {
                    await refreshData();
                  }}
                />
              </Collapse.Panel>
            )}
            {todayAbandonedTodoList.length > 0 && (
              <Collapse.Panel header="已放弃" key="abandoned">
                <TodoList
                  todoList={todayAbandonedTodoList}
                  onClickTodo={async (todo) => {
                    await showTodoDetail(todo);
                  }}
                  refreshTodoList={async () => {
                    await refreshData();
                  }}
                />
              </Collapse.Panel>
            )}
          </Collapse>
        </Flex>
      </Flex>
      {currentTodo && (
        <>
          <Divider type="vertical" className="!h-full" />
          <Flex container="fill" className="w-1/2 py-2">
            <TodoEditor
              todo={currentTodo}
              onClose={async () => {
                showTodoDetail(null);
              }}
              afterSubmit={async () => {
                refreshData();
              }}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
}
