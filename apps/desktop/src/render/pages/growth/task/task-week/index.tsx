import TaskList from '../../components/TaskList';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Collapse, Divider, Button } from '@sue/design-web-react';
import styles from './style.module.less';
import { TaskService } from '@true-north/web-service';
import { flushSync } from 'react-dom';
import { TaskWithoutRelationsVo } from '@true-north/vo';
import SiteIcon from '@/components/SiteIcon';
import { useTaskDetail, TaskEditor } from '../../components';
import { TaskStatus } from '@true-north/enum';

const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD');

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
    const { list: todos } = await TaskService.findByFilter({
      status: TaskStatus.TODO,
      // TODO: 需要根据新的 API 调整时间过滤参数
    });
    setWeekTaskList(todos);

    const { list: doneTasks } = await TaskService.findByFilter({
      status: TaskStatus.DONE,
      // TODO: 需要根据新的 API 调整时间过滤参数
    });
    setWeekDoneTaskList(doneTasks);

    const { list: expiredTasks } = await TaskService.findByFilter({
      status: TaskStatus.TODO,
      // TODO: 需要根据新的 API 调整时间过滤参数
    });
    setExpiredTaskList(expiredTasks);

    const { list: abandonedTasks } = await TaskService.findByFilter({
      status: TaskStatus.ABANDONED,
      // TODO: 需要根据新的 API 调整时间过滤参数
    });
    setWeekAbandonedTaskList(abandonedTasks);

    if (currentTask) {
      showTaskDetail(currentTask.id);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  const [currentTask, setCurrentTask] = useState<TaskWithoutRelationsVo | null>(
    null,
  );

  async function showTaskDetail(id: string) {
    flushSync(() => {
      setCurrentTask(null);
    });
    const todo = await TaskService.find(id);
    setCurrentTask(todo);
  }

  const { CreatePopover: CreateTaskPopover } = useTaskDetail();

  return (
    <div className="px-5 w-full h-full flex">
      <div className="w-full py-2">
        <CreateTaskPopover
          creatorProps={{
            afterSubmit: async () => {
              await refreshData();
            },
          }}
        >
          <Button className="!px-2" type="text" size="small">
            <div className="flex items-center gap-1">
              <SiteIcon id="add" />
              添加任务
            </div>
          </Button>
        </CreateTaskPopover>
        <Collapse
          defaultActiveKey={['expired', 'week']}
          className={`${styles['custom-collapse']} mt-2`}
          bordered={false}
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
      </div>
      {currentTask && (
        <>
          <Divider type="vertical" className="!h-full" />
          <div className="w-full py-2">
            <TaskEditor
              size="small"
              task={currentTask}
              onClose={async () => {
                showTaskDetail(null);
              }}
              afterSubmit={async () => {
                await refreshData();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
