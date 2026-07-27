import { TodoList, TodoCreatorMini, TodoEditor } from '../../components';
import { useEffect, useState } from 'react';
import { FlexibleContainer } from '@true-north/components-ui';
import { Collapse, Divider } from '@sue/design-web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { flushSync } from 'react-dom';
import { TodoVo, TodoWithoutRelationsVo } from '@true-north/vo';
import { useTodoHooks } from '../hooks';
import { TodoStatus } from '@true-north/enum';

const { Fixed, Shrink } = FlexibleContainer;

export default function TodoWeek() {
  const { weekStart, weekEnd } = useTodoHooks();
  const [weekTodoList, setWeekTodoList] = useState<TodoVo[]>([]);
  const [weekDoneTodoList, setWeekDoneTodoList] = useState<TodoVo[]>([]);
  const [expiredTodoList, setExpiredTodoList] = useState<TodoVo[]>([]);
  const [weekAbandonedTodoList, setWeekAbandonedTodoList] = useState<TodoVo[]>(
    [],
  );

  async function refreshData() {
    const { list: todos } = await TodoService.list({
      status: TodoStatus.TODO,
      planDateStart: weekStart,
      planDateEnd: weekEnd,
    });
    setWeekTodoList(todos);

    const { list: doneTodos } = await TodoService.list({
      status: TodoStatus.DONE,
      doneDateStart: weekStart,
      doneDateEnd: weekEnd,
    });
    setWeekDoneTodoList(doneTodos);

    const { list: expiredTodos } = await TodoService.list({
      status: TodoStatus.TODO,
      planDateEnd: weekStart,
    });
    setExpiredTodoList(expiredTodos);

    const { list: abandonedTodos } = await TodoService.list({
      status: TodoStatus.ABANDONED,
      abandonedDateStart: weekStart,
      abandonedDateEnd: weekEnd,
    });
    setWeekAbandonedTodoList(abandonedTodos);

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
    <FlexibleContainer className="bg-bg-2 rounded-lg w-full h-full">
      <Fixed className="px-5 py-2 flex justify-between items-center border-b">
        <div className="text-text-1 text-title-2 font-medium py-1">
          本周待办
        </div>
      </Fixed>

      <Shrink className="px-5 w-full h-full flex">
        <Shrink className="py-2" direction="horizontal">
          <Fixed>
            <TodoCreatorMini
              afterSubmit={async () => {
                refreshData();
              }}
            />
          </Fixed>
          <Shrink absolute overflowY="auto">
            <Collapse
              defaultActiveKey={['expired', 'week']}
              className={`${styles['custom-collapse']} mt-2`}
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
          </Shrink>
        </Shrink>
        {currentTodo && (
          <>
            <Divider type="vertical" className="!h-full" />{' '}
            <Shrink className="w-full py-2">
              <TodoEditor
                todo={currentTodo}
                onClose={async () => {
                  showTodoDetail(null);
                }}
                afterSubmit={async () => {
                  refreshData();
                }}
              />
            </Shrink>
          </>
        )}
      </Shrink>
    </FlexibleContainer>
  );
}
