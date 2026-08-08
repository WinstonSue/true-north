'use client';

import { Button, Flex, Tooltip } from '@sue/design-web-react';
import SiteIcon from '@/components/SiteIcon';
import { PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { isToday } from 'date-fns';
import { URGENCY_MAP, IMPORTANCE_MAP } from '../../constants';
import IconSelector from '../../components/IconSelector';
import { TodoService } from '@true-north/web-service';
import { TodoWithoutRelationsVo } from '@true-north/vo';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { TodoRelatedType, TodoStatus } from '@true-north/enum';
import styles from './style.module.less';
import { emitTodoChanged } from '../../events';
import { formatTodoPlanTime, isTodoPlanRange } from '../TodoDetail/planTime';
import { useFocusTimer } from '../../focus-timer';

export type TodoItemProps = {
  todo: TodoWithoutRelationsVo;
  onClickTodo: (todo: TodoWithoutRelationsVo) => Promise<void>;
  refreshTodoList: () => Promise<void>;
  TriggerCheckbox: React.ReactNode;
};

function TodoItem(props: TodoItemProps) {
  const { todo } = props;
  const { open: openFocusTimer } = useFocusTimer();
  const isActive = todo.status === TodoStatus.TODO;
  const canFocus = isActive && isTodoPlanRange(todo.planStartTime, todo.planEndTime);
  const planTimeLabel = formatTodoPlanTime(todo.planStartTime, todo.planEndTime);

  return (
    <div
      className={clsx(styles.todoItem, {
        [styles.done]: todo.status === TodoStatus.DONE,
        [styles.abandoned]: todo.status === TodoStatus.ABANDONED,
      })}
      key={todo.id}
    >
      <Flex container="full" className={styles.itemLayout} align="center" gap={12}>
        <Flex container="fixed" className={styles.checkbox}>
          {props.TriggerCheckbox}
        </Flex>
        <span
          className={clsx(styles.statusIndicator, {
            [styles.statusDone]: todo.status === TodoStatus.DONE,
            [styles.statusAbandoned]: todo.status === TodoStatus.ABANDONED,
          })}
          aria-hidden="true"
        />
        <Flex container="fill" onClick={() => props.onClickTodo(todo)} className={styles.content}>
          <div className={styles.header}>
            <span className={styles.title}>
              {todo.name}
              {todo.relatedType === TodoRelatedType.IS_REPEAT && (
                <SiteIcon id="repeat" className={styles.repeatIcon} width={20} height={20} />
              )}
            </span>
          </div>
          {todo.description && <p className={styles.description}>{todo.description}</p>}
          <div className={styles.meta}>
            {todo.importance && (
              <IconSelector map={IMPORTANCE_MAP} iconName="priority-0" value={todo.importance} readonly />
            )}
            {todo.urgency && (
              <IconSelector map={URGENCY_MAP} iconName="urgency" value={todo.urgency} readonly />
            )}
            <span className={todo.planDate < dayjs().format('YYYY-MM-DD') ? styles.overdue : styles.date}>
              {isToday(todo.planDate) ? '' : `${todo.planDate} `}
              {planTimeLabel}
            </span>
          </div>
        </Flex>
        {isActive && (
          <Flex container="fixed" className={styles.executionActions} align="center" gap={8}>
            {canFocus && (
              <Tooltip title="开始专注">
                <Button
                  size="small"
                  icon={<PlayCircleOutlined />}
                  aria-label={`为${todo.name}开始专注`}
                  onClick={(event) => {
                    event.stopPropagation();
                    openFocusTimer({ todoId: todo.id, label: todo.name });
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="放弃">
              <Button
                size="small"
                icon={<StopOutlined />}
                aria-label={`放弃 ${todo.name}`}
                onClick={async (event) => {
                  event.stopPropagation();
                  await TodoService.abandon(todo.relatedType, todo.id);
                  emitTodoChanged();
                  await props.refreshTodoList();
                }}
              />
            </Tooltip>
          </Flex>
        )}
      </Flex>
    </div>
  );
}

export default TodoItem;
