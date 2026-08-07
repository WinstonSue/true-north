'use client';

import { Tag, Popover, Button, Flex } from '@sue/design-web-react';
import SiteIcon from '@/components/SiteIcon';
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

export type TodoItemProps = {
  todo: TodoWithoutRelationsVo;
  onClickTodo: (todo: TodoWithoutRelationsVo) => Promise<void>;
  refreshTodoList: () => Promise<void>;
  TriggerCheckbox: React.ReactNode;
};

function TodoItem(props: TodoItemProps) {
  const { todo } = props;
  const isActive = todo.status === TodoStatus.TODO || todo.status === TodoStatus.IN_PROGRESS;
  const canMarkIncomplete =
    isActive &&
    (todo.relatedType === TodoRelatedType.HABIT ||
      todo.relatedType === TodoRelatedType.IS_REPEAT ||
      todo.relatedType === TodoRelatedType.REPEAT);

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
              {todo.planStartTime && todo.planEndTime ? `${todo.planStartTime}-${todo.planEndTime}` : null}
            </span>
            {todo.tags?.length > 0 && (
              <div className={styles.tags}>
                {todo.tags.map((tag, index) => (
                  <Tag key={index} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </Flex>
        <Flex container="fixed" className={styles.executionActions} align="center" gap={8}>
          {canMarkIncomplete && (
            <Button
              size="small"
              onClick={async (event) => {
                event.stopPropagation();
                await TodoService.abandon(todo.relatedType, todo.id);
                emitTodoChanged();
                await props.refreshTodoList();
              }}
            >
              未完成
            </Button>
          )}
          <Popover
            trigger="click"
            content={
              <div className={styles.menu}>
                {todo.status === TodoStatus.TODO && (
                  <div
                    className={styles.menuItem}
                    onClick={async () => {
                      await TodoService.start(todo.relatedType, todo.id);
                      emitTodoChanged();
                      await props.refreshTodoList();
                    }}
                  >
                    开始
                  </div>
                )}
                {todo.status === TodoStatus.IN_PROGRESS && (
                  <div
                    className={styles.menuItem}
                    onClick={async () => {
                      await TodoService.pause(todo.relatedType, todo.id);
                      emitTodoChanged();
                      await props.refreshTodoList();
                    }}
                  >
                    暂停
                  </div>
                )}
                <div
                  className={styles.menuItem}
                  onClick={async () => {
                    await TodoService.abandon(todo.relatedType, todo.id);
                    emitTodoChanged();
                    await props.refreshTodoList();
                  }}
                >
                  放弃
                </div>
                <div
                  className={styles.menuItem}
                  onClick={async () => {
                    await TodoService.delete(todo.relatedType, todo.id);
                    emitTodoChanged();
                    await props.refreshTodoList();
                  }}
                >
                  删除
                </div>
              </div>
            }
          >
            <Button
              onClick={(e) => e.stopPropagation()}
              type="text"
              size="small"
              icon={<SiteIcon id="more-for-task" />}
              className={styles.moreButton}
            />
          </Popover>
        </Flex>
      </Flex>
    </div>
  );
}

export default TodoItem;
