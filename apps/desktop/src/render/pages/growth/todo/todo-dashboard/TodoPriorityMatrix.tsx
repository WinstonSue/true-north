'use client';

import { Tag } from '@sue/design-web-react';

import { TodoVo } from '@true-north/vo';

interface TodoPriorityMatrixProps {
  todoList: TodoVo[];
}

export function TodoPriorityMatrix({ todoList }: TodoPriorityMatrixProps) {
  // 按优先级分类任务
  const priorityMatrix = {
    urgent_important: todoList.filter(
      (todo) =>
      todo.importance === 1 && todo.urgency === 1 && todo.status === 'todo'
    ),
    urgent_not_important: todoList.filter(
      (todo) =>
      todo.importance === 2 && todo.urgency === 1 && todo.status === 'todo'
    ),
    not_urgent_important: todoList.filter(
      (todo) =>
      todo.importance === 1 && todo.urgency === 2 && todo.status === 'todo'
    ),
    not_urgent_not_important: todoList.filter(
      (todo) =>
      todo.importance === 2 && todo.urgency === 2 && todo.status === 'todo'
    )
  };

  const MatrixItem = ({
    title,
    color,
    tasks,
    description

  }: {title: string;color: string;tasks: TodoVo[];description: string;}) =>
  <div className="bg-fill-1 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <Tag color={color} >
          {tasks.length}
        </Tag>
        <span className="text-text-1" style={{ fontSize: 12, fontWeight: 500 }}>
          {title}
        </span>
      </div>
      <span

      className="text-text-3 block mb-3 text-text-3" style={{ fontSize: 11 }}>

        {description}
      </span>
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task) =>
      <div key={task.id} className="bg-bg-2 rounded px-2 py-1">
            <span className="truncate text-text-2" style={{ fontSize: 11 }}>
              {task.name}
            </span>
          </div>
      )}
        {tasks.length > 3 &&
      <span

        className="text-text-3 block text-center pt-1 text-text-3" style={{ fontSize: 10 }}>

            +{tasks.length - 3} 更多
          </span>
      }
      </div>
    </div>;

  return (
    <div className="bg-bg-2 rounded-xl p-6 shadow-sm border border-border-1 h-full">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-link-light-1 rounded-lg flex items-center justify-center mr-3">
          <div className="w-5 h-5 bg-link rounded"></div>
        </div>
        <div>
          <h5 className="text-title-1 font-medium !mb-0">
            优先级矩阵
          </h5>
          <div className="text-sm text-text-3">
            基于艾森豪威尔矩阵的任务分类
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 h-64">
        <MatrixItem
          title="紧急重要"
          color="red"
          tasks={priorityMatrix.urgent_important}
          description="立即处理" />

        <MatrixItem
          title="紧急不重要"
          color="orange"
          tasks={priorityMatrix.urgent_not_important}
          description="委托他人" />

        <MatrixItem
          title="不紧急重要"
          color="blue"
          tasks={priorityMatrix.not_urgent_important}
          description="计划安排" />

        <MatrixItem
          title="不紧急不重要"
          color="gray"
          tasks={priorityMatrix.not_urgent_not_important}
          description="有空再做" />

      </div>
    </div>);

}