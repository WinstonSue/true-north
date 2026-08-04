import { TodoList, TodoCreatorMini, TodoEditor } from '../../components';
import { useEffect, useState } from 'react';
import { Collapse, Divider, Flex } from '@sue/design-web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { flushSync } from 'react-dom';
import { TodoVo, TodoWithoutRelationsVo } from '@true-north/vo';
import { useTodoHooks } from '../hooks';
import { TodoStatus } from '@true-north/enum';
import dayjs from 'dayjs';

export default function TodoWeek() {
  const { weekStart, weekEnd } = useTodoHooks();
  const [weekTodoList, setWeekTodoList] = useState<TodoVo[]>([]);
  const [weekDoneTodoList, setWeekDoneTodoList] = useState<TodoVo[]>([]);
  const [expiredTodoList, setExpiredTodoList] = useState<TodoVo[]>([]);
  const [weekAbandonedTodoList, setWeekAbandonedTodoList] = useState<TodoVo[]>(
    [],
  );

  async function refreshData() {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const mergeActive = (responses: Array<{ list?: TodoVo[] } | undefined>) =>
      [...new Map(responses.flatMap((response) => response?.list || []).map((todo) => [todo.id, todo])).values()]
        .sort((a, b) => (a.planStartTime || '').localeCompare(b.planStartTime || ''));
    const [weekTodo, weekInProgress, doneResponse, expiredTodo, expiredInProgress, abandonedResponse] = await Promise.all([
      TodoService.list({ status: TodoStatus.TODO, planDateStart: weekStart, planDateEnd: weekEnd }),
      TodoService.list({ status: TodoStatus.IN_PROGRESS, planDateStart: weekStart, planDateEnd: weekEnd }),
      TodoService.list({ status: TodoStatus.DONE, doneDateStart: weekStart, doneDateEnd: weekEnd }),
      TodoService.list({ status: TodoStatus.TODO, planDateEnd: yesterday }),
      TodoService.list({ status: TodoStatus.IN_PROGRESS, planDateEnd: yesterday }),
      TodoService.list({ status: TodoStatus.ABANDONED, abandonedDateStart: weekStart, abandonedDateEnd: weekEnd }),
    ]);
    setWeekTodoList(mergeActive([weekTodo, weekInProgress]));
    setWeekDoneTodoList(doneResponse?.list || []);
    setExpiredTodoList(mergeActive([expiredTodo, expiredInProgress]));
    setWeekAbandonedTodoList(abandonedResponse?.list || []);

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
    const todo = await TodoService.find(_todo.relatedType, _todo.id);

    setCurrentTodo(todo);
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
              defaultActiveKey={['expired', 'week']}
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
              {weekTodoList.length > 0 && (
                <Collapse.Panel header="本周" key="week">
                  <TodoList
                    todoList={weekTodoList}
                    onClickTodo={async (todo) => {
                      await showTodoDetail(todo);
                    }}
                    refreshTodoList={async () => {
                      await refreshData();
                    }}
                  />
                </Collapse.Panel>
              )}
              {weekDoneTodoList.length > 0 && (
                <Collapse.Panel header="已完成" key="done">
                  <TodoList
                    todoList={weekDoneTodoList}
                    onClickTodo={async (todo) => {
                      await showTodoDetail(todo);
                    }}
                    refreshTodoList={async () => {
                      await refreshData();
                    }}
                  />
                </Collapse.Panel>
              )}
              {weekAbandonedTodoList.length > 0 && (
                <Collapse.Panel header="已放弃" key="abandoned">
                  <TodoList
                    todoList={weekAbandonedTodoList}
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
