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
import { TodoRelatedType } from '@true-north/enum';

export type TodoItemProps = {
  todo: TodoWithoutRelationsVo;
  onClickTodo: (todo: TodoWithoutRelationsVo) => Promise<void>;
  refreshTodoList: () => Promise<void>;
  TriggerCheckbox: React.ReactNode;
};

function TodoItem(props: TodoItemProps) {
  const { todo } = props;
  return (
    <div className={'w-full pl-4 py-2 bg-bg'} key={todo.id}>
      <Flex container="full" className="items-start" align="flex-start">
        <Flex container="fixed" className="h-full flex items-start">
          {props.TriggerCheckbox}
        </Flex>
        <Flex
          container="fill"
          onClick={() => props.onClickTodo(todo)}
          className={clsx([
          'cursor-pointer border-b',
          'after:content-[""] after:block after:h-1 after:w-full']
          )}>

          <div
            className={clsx(['flex items-center justify-between', 'leading-8'])}>

            <span className="text-text-1 flex items-center">
              {todo.name}
              {todo.relatedType === TodoRelatedType.IS_REPEAT &&
              <SiteIcon
                id={'repeat'}
                className={'text-danger'}
                width={20}
                height={20} />

              }
            </span>
            <div className="h-8 flex items-center">
              <Popover
                trigger="click"
                content={
                <div className="w-40">
                    <div
                    className="cursor-pointer px-3 h-9 leading-9 hover:bg-fill-2"
                    onClick={() => {
                      TodoService.abandon(todo.relatedType, todo.id);
                      props.refreshTodoList();
                    }}>

                      放弃
                    </div>
                    <div
                    className="cursor-pointer px-3 h-9 leading-9 hover:bg-fill-2"
                    onClick={() => {
                      TodoService.delete(todo.relatedType, todo.id);
                      props.refreshTodoList();
                    }}>

                      删除
                    </div>
                  </div>
                }>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  iconOnly
                  type="text"
                  size="mini"
                  icon={<SiteIcon id="more-for-task" />}
                  className="!flex justify-center items-center !text-text" />

              </Popover>
            </div>
          </div>
          {todo.description &&
          <p
            className="text-body-1 !mb-0.5"
            style={{
              textDecoration:
              todo.status === 'done' ? 'line-through' : 'none',
              color: 'var(--color-text-3)'
            }}>

              {todo.description}
            </p>
          }
          <div className={clsx(['flex items-center gap-2', 'text-body-2'])}>
            {todo.importance &&
            <IconSelector
              map={IMPORTANCE_MAP}
              iconName="priority-0"
              value={todo.importance}
              readonly />

            }

            {todo.urgency &&
            <IconSelector
              map={URGENCY_MAP}
              iconName="urgency"
              value={todo.urgency}
              readonly />

            }

            {!isToday(todo.planDate) &&
            <span
              className={
              todo.planDate < dayjs().format('YYYY-MM-DD') ?
              'text-danger' :
              'text-text-3'
              }>

                {todo.planDate}
                {todo.planStartTime && todo.planEndTime &&
              <>
                    {todo.planStartTime}-{todo.planEndTime}
                  </>
              }
              </span>
            }
            {todo.tags?.length > 0 &&
            <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag, index) =>
              <Tag key={index} color="arcoblue">
                    {tag}
                  </Tag>
              )}
              </div>
            }
          </div>
        </Flex>
      </Flex>
    </div>);

}

export default TodoItem;