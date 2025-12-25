'use client';

import React, { useState } from 'react';
import { Tree, Input, Button, Empty } from '@arco-design/web-react';
import { IconSearch, IconPlus } from '@arco-design/web-react/icon';
import { useTaskDetailContext } from './context';
import { TaskVo } from '@true-north/vo';
import { TaskStatus } from '@true-north/enum';
import clsx from 'clsx';

interface TaskAsideProps {
  currentTaskId: string;
}

const TaskAside: React.FC<TaskAsideProps> = ({ currentTaskId }) => {
  const {
    taskTree,
    selectedTaskId,
    setSelectedTaskId,
    fetchTaskDetail,
    loading,
  } = useTaskDetailContext();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 构建树形数据
  const buildTreeData = (tasks: TaskVo[]) => {
    const taskMap = new Map<string, TaskVo>();
    tasks.forEach(task => taskMap.set(task.id, task));

    const rootTasks: TaskVo[] = [];
    const childrenMap = new Map<string, TaskVo[]>();

    tasks.forEach(task => {
      if (!task.parentId) {
        rootTasks.push(task);
      } else {
        if (!childrenMap.has(task.parentId)) {
          childrenMap.set(task.parentId, []);
        }
        childrenMap.get(task.parentId)!.push(task);
      }
    });

    const convertToTreeNode = (task: TaskVo): any => {
      const children = childrenMap.get(task.id) || [];
      return {
        key: task.id,
        title: (
          <div className="flex items-center justify-between w-full">
            <span className={clsx(
              'truncate',
              task.status === TaskStatus.DONE && 'line-through text-gray-400'
            )}>
              {task.name}
            </span>
            <div className="flex items-center gap-1">
              {getStatusTag(task.status)}
            </div>
          </div>
        ),
        children: children.map(convertToTreeNode),
        isLeaf: children.length === 0,
      };
    };

    return rootTasks.map(convertToTreeNode);
  };

  // 获取状态标签
  const getStatusTag = (status: TaskStatus) => {
    if (!status) {
      return null;
    }
    const statusConfig = {
      [TaskStatus.TODO]: { color: 'gray', text: '待办' },
      [TaskStatus.DOING]: { color: 'blue', text: '进行' },
      [TaskStatus.DONE]: { color: 'green', text: '完成' },
      [TaskStatus.ABANDONED]: { color: 'red', text: '放弃' },
    };

    const config = statusConfig[status];
    return (
      <span 
        className={clsx(
          'px-1 py-0.5 text-xs rounded',
          config.color === 'gray' && 'bg-gray-100 text-gray-600',
          config.color === 'blue' && 'bg-blue-100 text-blue-600',
          config.color === 'green' && 'bg-green-100 text-green-600',
          config.color === 'red' && 'bg-red-100 text-red-600',
        )}
      >
        {config.text}
      </span>
    );
  };

  // 过滤任务
  const filteredTasks = taskTree.filter(task =>
    !searchKeyword || task.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const treeData = buildTreeData(filteredTasks);

  // 处理节点选择
  const handleSelect = (selectedKeys: string[]) => {
    if (selectedKeys.length > 0) {
      const taskId = selectedKeys[0];
      setSelectedTaskId(taskId);
      fetchTaskDetail(taskId);
    }
  };

  // 展开当前任务的父链
  React.useEffect(() => {
    if (currentTaskId && taskTree.length > 0) {
      const expandKeys: string[] = [];
      const findParentChain = (taskId: string) => {
        const task = taskTree.find(t => t.id === taskId);
        if (task?.parentId) {
          expandKeys.push(task.parentId);
          findParentChain(task.parentId);
        }
      };
      findParentChain(currentTaskId);
      setExpandedKeys(expandKeys);
    }
  }, [currentTaskId, taskTree]);

  return (
    <div className="flex flex-col h-full">
      {/* 搜索和操作栏 */}
      <div className="p-4 border-b border-border-2">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="搜索任务..."
            prefix={<IconSearch />}
            value={searchKeyword}
            onChange={setSearchKeyword}
            allowClear
          />
          <Button
            type="primary"
            icon={<IconPlus />}
            size="small"
            className="w-full"
          >
            新建任务
          </Button>
        </div>
      </div>

      {/* 任务树 */}
      <div className="flex-1 overflow-auto p-2">
        {treeData.length > 0 ? (
          <Tree
            treeData={treeData}
            selectedKeys={[selectedTaskId]}
            expandedKeys={expandedKeys}
            onSelect={handleSelect}
            onExpand={setExpandedKeys}
            blockNode
            showLine
            className="task-tree"
          />
        ) : (
          <Empty description="暂无任务数据" />
        )}
      </div>
    </div>
  );
};

export default TaskAside;
