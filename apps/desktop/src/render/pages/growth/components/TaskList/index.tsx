'use client';

import { TaskWithoutRelationsVo } from '@true-north/vo';
import TaskItem from './TaskItem';

function TaskList(props: {
  taskList: TaskWithoutRelationsVo[];
  onClickTask: (id: string) => Promise<void>;
  refreshTaskList: () => Promise<void>;
}) {
  return (
    <div className="w-full mt-[-8px]">
      {props.taskList.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClickTask={props.onClickTask}
          refreshTaskList={props.refreshTaskList}
        />
      ))}
    </div>
  );
}

export default TaskList;
