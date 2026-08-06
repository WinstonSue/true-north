import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Flex } from '@sue/design-web-react';
import styles from './style.module.less';
import { TodoService } from '@true-north/web-service';
import { TodoVo, TodoWithoutRelationsVo } from '@true-north/vo';
import { useTodoHooks } from '../hooks';
import { TodoStatus } from '@true-north/enum';
import { useTodoDetail } from '../../components';
import TodoAgendaSections from '../components/TodoAgendaSections';
import { onTodoChanged } from '../../events';

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

  }

  useEffect(() => {
    void refreshData();
    return onTodoChanged(() => { void refreshData(); });
  }, []);

  const { openEditDrawer } = useTodoDetail();

  async function showTodoDetail(todo: TodoWithoutRelationsVo) {
    openEditDrawer({
      contentProps: {
        todo: todo as TodoVo,
        afterSubmit: refreshData,
      },
    });
  }

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fixed" className={styles.toolbar} align="center">
        <div className={styles.heading}>
          <h1 className={styles.title}>今日待办</h1>
          <span className={styles.subtitle}>{dayjs(today).format('YYYY年M月D日 dddd')}</span>
        </div>
      </Flex>
      <Flex vertical container="fill" className={styles.content}>
        <TodoAgendaSections
          groups={[
            { key: 'expired', label: '已过期', todoList: expiredTodoList },
            { key: 'today', label: '今天', todoList: todayTodoList },
            { key: 'done', label: '已完成', todoList: todayDoneTodoList },
            { key: 'abandoned', label: '已放弃', todoList: todayAbandonedTodoList },
          ]}
          emptyLabel="今天没有待办"
          onClickTodo={showTodoDetail}
          refreshTodoList={refreshData}
        />
      </Flex>
    </Flex>
  );
}
