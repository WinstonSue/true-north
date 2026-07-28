'use client';

import { Tag, Popover, Button, Card } from '@sue/design-web-react';
import SiteIcon from '@/components/SiteIcon';
import IconSelector from '../../components/IconSelector';
import { URGENCY_MAP, IMPORTANCE_MAP } from '../../constants';
import { TaskService } from '@true-north/web-service';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import clsx from 'clsx';

export type TaskItemProps = {
  task: TaskWithoutRelationsVo;
  onClickTask: (id: string) => Promise<void>;
  refreshTaskList: () => Promise<void>;
};

function TaskItem(props: TaskItemProps) {
  const { task } = props;
  return (
    <Card
      bordered
      size="small"
      className={clsx(
        'w-full bg-bg-3',
        '!border-border-1',
        'cursor-pointer',
        'hover:!bg-fill-1'
      )}
      key={task.id}
      onClick={() => props.onClickTask(task.id)}>

      <div className={clsx(['flex items-center justify-between', 'leading-8'])}>
        <span className="text-text-1">{task.name}</span>

        <div className="h-8 flex items-center">
          <Popover
            trigger="click"
            content={
            <div className="w-40">
                <div
                className="cursor-pointer px-3 h-9 leading-9 hover:bg-fill-2"
                onClick={() => {
                  TaskService.abandon(task.id);
                  props.refreshTaskList();
                }}>

                  放弃
                </div>
                <div
                className="cursor-pointer px-3 h-9 leading-9 hover:bg-fill-2"
                onClick={() => {
                  TaskService.delete(task.id);
                  props.refreshTaskList();
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
      {task.description &&
      <p
        className="text-body-1 !mb-0.5"
        style={{
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          color: 'var(--color-text-3)'
        }}>

          {task.description}
        </p>
      }
      <div className={clsx(['flex items-center gap-2', 'text-body-2'])}>
        {task.importance &&
        <IconSelector
          map={IMPORTANCE_MAP}
          iconName="priority-0"
          value={task.importance}
          readonly />

        }

        {task.urgency &&
        <IconSelector
          map={URGENCY_MAP}
          iconName="urgency"
          value={task.urgency}
          readonly />

        }
        {task.tags?.length > 0 &&
        <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) =>
          <Tag key={index} color="blue">
                {tag}
              </Tag>
          )}
          </div>
        }
      </div>
    </Card>);

}

export default TaskItem;