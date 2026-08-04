'use client';

import { Tag, Popover, Button, Card } from '@sue/design-web-react';
import SiteIcon from '@/components/SiteIcon';
import IconSelector from '../../components/IconSelector';
import { URGENCY_MAP, IMPORTANCE_MAP } from '../../constants';
import { TaskService } from '@true-north/web-service';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import { TaskStatus } from '@true-north/enum';
import { useFocusTimer } from '../../focus-timer';
import styles from './style.module.less';

export type TaskItemProps = {
  task: TaskWithoutRelationsVo;
  onClickTask: (id: string) => Promise<void>;
  refreshTaskList: () => Promise<void>;
};

function TaskItem(props: TaskItemProps) {
  const { task } = props;
  const { open: openFocusTimer } = useFocusTimer();
  const isActive = task.status === TaskStatus.TODO || task.status === TaskStatus.DOING;
  return (
    <Card
      size="small"
      className={styles.taskItem}
      key={task.id}
      onClick={() => props.onClickTask(task.id)}>

      <div className={styles.header}>
        <span className={styles.title}>{task.name}</span>

        <div className={styles.action}>
          <Popover
            trigger="click"
            content={
            <div className={styles.menu}>
                {task.status === TaskStatus.TODO && (
                  <div
                    className={styles.menuItem}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await TaskService.start(task.id);
                      await props.refreshTaskList();
                    }}
                  >
                    开始
                  </div>
                )}
                {task.status === TaskStatus.DOING && (
                  <div
                    className={styles.menuItem}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await TaskService.pause(task.id);
                      await props.refreshTaskList();
                    }}
                  >
                    暂停
                  </div>
                )}
                {isActive && (
                  <div
                    className={styles.menuItem}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await TaskService.markDone(task.id);
                      await props.refreshTaskList();
                    }}
                  >
                    标记完成
                  </div>
                )}
                {isActive && (
                  <div
                    className={styles.menuItem}
                    onClick={(event) => {
                      event.stopPropagation();
                      openFocusTimer(task.id);
                    }}
                  >
                    开始专注
                  </div>
                )}
                {isActive && (
                  <div
                    className={styles.menuItem}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await TaskService.abandon(task.id);
                      await props.refreshTaskList();
                    }}
                  >
                    放弃
                  </div>
                )}
                <div
                className={styles.menuItem}
                onClick={async (event) => {
                  event.stopPropagation();
                  await TaskService.delete(task.id);
                  await props.refreshTaskList();
                }}>

                  删除
                </div>
              </div>
            }>

            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              type="text"
              size="small"
              icon={<SiteIcon id="more-for-task" />}
              className={styles.moreButton} />

          </Popover>
        </div>
      </div>
      {task.description &&
      <p
        className={styles.description}>

          {task.description}
        </p>
      }
      <div className={styles.meta}>
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
        <div className={styles.tags}>
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
