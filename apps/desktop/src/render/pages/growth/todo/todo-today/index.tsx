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
    const mergeActive = (responses: Array<{ list?: TodoVo[] } | undefined>) =>
      [...new Map(responses.flatMap((response) => response?.list || []).map((todo) => [todo.id, todo])).values()]
        .sort((a, b) => (a.planStartTime || '').localeCompare(b.planStartTime || ''));
    const [todayTodo, todayInProgress, doneResponse, expiredTodo, expiredInProgress, abandonedResponse] = await Promise.all([
      TodoService.list({ status: TodoStatus.TODO, planDateStart: today, planDateEnd: today }),
      TodoService.list({ status: TodoStatus.IN_PROGRESS, planDateStart: today, planDateEnd: today }),
      TodoService.list({ status: TodoStatus.DONE, doneDateStart: today, doneDateEnd: today }),
      TodoService.list({ status: TodoStatus.TODO, planDateEnd: yesterday }),
      TodoService.list({ status: TodoStatus.IN_PROGRESS, planDateEnd: yesterday }),
      TodoService.list({ status: TodoStatus.ABANDONED, abandonedDateStart: today, abandonedDateEnd: today }),
    ]);
    setTodayTodoList(mergeActive([todayTodo, todayInProgress]));

    setTodayDoneTodoList(doneResponse?.list || []);

    setExpiredTodoList(mergeActive([expiredTodo, expiredInProgress]));

    setTodayAbandonedTodoList(abandonedResponse?.list || []);

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
    <Flex container="full" className={styles.page}>
      <Flex vertical container="fill" className={styles.listPane}>
        <Flex container="fixed" className={styles.toolbar}>
          <TodoCreatorMini
            afterSubmit={async () => {
              refreshData();
            }}
          />
        </Flex>
        <Flex container="fill" className={styles.content}>
          <Collapse
            defaultActiveKey={['expired', 'today']}
            className={styles.collapse}

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
          <Divider vertical className={styles.divider} />
          <Flex container="fill" className={styles.detailPane}>
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
