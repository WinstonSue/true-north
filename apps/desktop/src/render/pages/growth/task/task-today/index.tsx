import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Collapse, Flex } from '@sue/design-web-react';
import { TaskService } from '@true-north/web-service';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import { TaskStatus } from '@true-north/enum';
import TaskList from '../../components/TaskList';
import { openTaskDetailDrawer } from '../detail/TaskDetailDrawer';
import styles from './style.module.less';
import { onTaskChanged } from '../../events';

type TaskGroups = {
  expired: TaskWithoutRelationsVo[];
  today: TaskWithoutRelationsVo[];
  done: TaskWithoutRelationsVo[];
  abandoned: TaskWithoutRelationsVo[];
};

export default function TaskToday() {
  const [groups, setGroups] = useState<TaskGroups>({ expired: [], today: [], done: [], abandoned: [] });

  const refreshData = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const activeStatuses = [TaskStatus.TODO, TaskStatus.DOING];
    const mergeActive = (responses: Array<{ list?: TaskWithoutRelationsVo[] } | undefined>) =>
      [...new Map(responses.flatMap((response) => response?.list || []).map((task) => [task.id, task])).values()]
        .sort((a, b) => (a.startAt || '').localeCompare(b.startAt || '') || (a.endAt || '').localeCompare(b.endAt || ''));
    const [expiredTodo, expiredDoing, todayTodo, todayDoing, done, abandoned] = await Promise.all([
      ...activeStatuses.map((status) => TaskService.findByFilter({ status, endDateEnd: yesterday })),
      ...activeStatuses.map((status) => TaskService.findByFilter({ status, startDateEnd: today, endDateStart: today })),
      TaskService.findByFilter({ status: TaskStatus.DONE, doneDateStart: today, doneDateEnd: today }),
      TaskService.findByFilter({ status: TaskStatus.ABANDONED, abandonedDateStart: today, abandonedDateEnd: today }),
    ]);
    setGroups({
      expired: mergeActive([expiredTodo, expiredDoing]),
      today: mergeActive([todayTodo, todayDoing]),
      done: done?.list || [],
      abandoned: abandoned?.list || [],
    });
  };

  useEffect(() => {
    void refreshData();
    return onTaskChanged(() => { void refreshData(); });
  }, []);

  const renderGroup = (key: keyof TaskGroups, label: string) => groups[key].length ? (
    <Collapse.Panel header={label} key={key}>
      <TaskList
        taskList={groups[key]}
        onClickTask={async (id) => { openTaskDetailDrawer({ taskId: id, onRefresh: refreshData }); }}
        refreshTaskList={refreshData}
      />
    </Collapse.Panel>
  ) : null;

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fill" className={styles.content}>
        <Collapse defaultActiveKey={['expired', 'today']} className={styles.collapse}>
          {renderGroup('expired', '已过期')}
          {renderGroup('today', '今日')}
          {renderGroup('done', '已完成')}
          {renderGroup('abandoned', '已放弃')}
        </Collapse>
      </Flex>
    </Flex>
  );
}
