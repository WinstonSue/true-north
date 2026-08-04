import TaskList from '../../components/TaskList';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Collapse, Button, Flex } from '@sue/design-web-react';
import styles from './style.module.less';
import { TaskService } from '@true-north/web-service';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import SiteIcon from '@/components/SiteIcon';
import { useTaskDetail } from '../../components';
import { TaskStatus } from '@true-north/enum';
import { openTaskDetailDrawer } from '../detail/TaskDetailDrawer';

export default function TaskWeek() {
  const [weekTaskList, setWeekTaskList] = useState<TaskWithoutRelationsVo[]>(
    [],
  );
  const [weekDoneTaskList, setWeekDoneTaskList] = useState<
    TaskWithoutRelationsVo[]
  >([]);
  const [expiredTaskList, setExpiredTaskList] = useState<
    TaskWithoutRelationsVo[]
  >([]);
  const [weekAbandonedTaskList, setWeekAbandonedTaskList] = useState<
    TaskWithoutRelationsVo[]
  >([]);

  async function refreshData() {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day').format('YYYY-MM-DD');
    const weekStart = today.startOf('week').format('YYYY-MM-DD');
    const weekEnd = today.endOf('week').format('YYYY-MM-DD');

    const activeStatuses = [TaskStatus.TODO, TaskStatus.DOING];
    const mergeActive = (responses: Array<{ list?: TaskWithoutRelationsVo[] } | undefined>) =>
      [...new Map(responses.flatMap((response) => response?.list || []).map((task) => [task.id, task])).values()]
        .sort((a, b) => (a.startAt || '').localeCompare(b.startAt || '') || (a.endAt || '').localeCompare(b.endAt || ''));
    const [weekTodo, weekDoing, doneResponse, expiredTodo, expiredDoing, abandonedResponse] = await Promise.all([
      ...activeStatuses.map((status) => TaskService.findByFilter({
        status,
        startDateEnd: weekEnd,
        endDateStart: weekStart,
      })),
      TaskService.findByFilter({
        status: TaskStatus.DONE,
        doneDateStart: weekStart,
        doneDateEnd: weekEnd,
      }),
      ...activeStatuses.map((status) => TaskService.findByFilter({ status, endDateEnd: yesterday })),
      TaskService.findByFilter({
        status: TaskStatus.ABANDONED,
        abandonedDateStart: weekStart,
        abandonedDateEnd: weekEnd,
      }),
    ]);
    setWeekTaskList(mergeActive([weekTodo, weekDoing]));

    setWeekDoneTaskList(doneResponse?.list || []);

    setExpiredTaskList(mergeActive([expiredTodo, expiredDoing]));

    setWeekAbandonedTaskList(abandonedResponse?.list || []);

  }

  useEffect(() => {
    refreshData();
  }, []);

  function showTaskDetail(id: string) {
    openTaskDetailDrawer({ taskId: id, onRefresh: refreshData });
  }

  const { CreatePopover: CreateTaskPopover } = useTaskDetail();

  return (
    <Flex vertical container="full" className={styles.page}>
      <Flex container="fixed" className={styles.toolbar} align="center">
        <CreateTaskPopover
          creatorProps={{
            afterSubmit: async () => {
              await refreshData();
            },
          }}
        >
          <Button type="text" size="small">
            <span className={styles.createLabel}>
              <SiteIcon id="add" />
              添加任务
            </span>
          </Button>
        </CreateTaskPopover>
      </Flex>
      <Flex container="fill" className={styles.content}>
        <Collapse
          defaultActiveKey={['expired', 'week']}
          className={styles.collapse}

        >
          {expiredTaskList.length > 0 && (
            <Collapse.Panel header="已过期" key="expired">
              <TaskList
                taskList={expiredTaskList}
                onClickTask={async (id) => {
                  await showTaskDetail(id);
                }}
                refreshTaskList={async () => {
                  await refreshData();
                }}
              />
            </Collapse.Panel>
          )}
          {weekTaskList.length > 0 && (
            <Collapse.Panel header="本周" key="week">
              <TaskList
                taskList={weekTaskList}
                onClickTask={async (id) => {
                  await showTaskDetail(id);
                }}
                refreshTaskList={async () => {
                  await refreshData();
                }}
              />
            </Collapse.Panel>
          )}
          {weekDoneTaskList.length > 0 && (
            <Collapse.Panel header="已完成" key="done">
              <TaskList
                taskList={weekDoneTaskList}
                onClickTask={async (id) => {
                  await showTaskDetail(id);
                }}
                refreshTaskList={async () => {
                  await refreshData();
                }}
              />
            </Collapse.Panel>
          )}
          {weekAbandonedTaskList.length > 0 && (
            <Collapse.Panel header="已放弃" key="abandoned">
              <TaskList
                taskList={weekAbandonedTaskList}
                onClickTask={async (id) => {
                  await showTaskDetail(id);
                }}
                refreshTaskList={async () => {
                  await refreshData();
                }}
              />
            </Collapse.Panel>
          )}
        </Collapse>
      </Flex>
    </Flex>
  );
}
