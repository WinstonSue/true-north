'use client';

import React, { useState } from 'react';
import { FlexibleContainer } from '@true-north/components-ui';
import { Tabs, Tag, Dropdown, Menu, Button, Modal, message } from '@sue/design-web-react';
import {
  IconMore,
  IconEdit,
  IconDelete,
  IconClose,
  IconCheck,
} from '@true-north/components-ui';
import { TaskVo } from '@true-north/vo';
import { TaskStatus } from '@true-north/enum';
import { TaskService } from '@true-north/web-service';
import { useTaskDetailContext } from './context';
import clsx from 'clsx';

const { Fixed, Shrink } = FlexibleContainer;

interface TaskMainProps {
  task: TaskVo;
}

// 状态配置映射
const STATUS_CONFIG = {
  [TaskStatus.TODO]: {
    label: '待办',
    color: 'gray',
  },
  [TaskStatus.DOING]: {
    label: '进行中',
    color: 'blue',
  },
  [TaskStatus.DONE]: {
    label: '已完成',
    color: 'green',
  },
  [TaskStatus.ABANDONED]: {
    label: '已放弃',
    color: 'red',
  },
};

const TaskMain: React.FC<TaskMainProps> = ({ task }) => {
  const { refreshData } = useTaskDetailContext();
  const [activeTab, setActiveTab] = useState('overview');

  // 标记完成
  const handleComplete = async () => {
    try {
      await TaskService.update(task.id, {
        status: TaskStatus.DONE,
        doneAt: new Date().toISOString(),
      });
      message.success('任务已标记为完成');
      await refreshData();
    } catch (error) {
      console.error('标记完成失败:', error);
      message.error('标记完成失败');
    }
  };

  // 恢复任务
  const handleRestore = async () => {
    try {
      await TaskService.update(task.id, {
        status: TaskStatus.TODO,
        doneAt: null,
        abandonedAt: null,
      });
      message.success('任务已恢复');
      await refreshData();
    } catch (error) {
      console.error('恢复失败:', error);
      message.error('恢复失败');
    }
  };

  // 放弃任务
  const handleAbandon = () => {
    Modal.confirm({
      title: '确定放弃任务吗？',
      content: '放弃后可以重新激活，是否继续？',
      onOk: async () => {
        try {
          await TaskService.update(task.id, {
            status: TaskStatus.ABANDONED,
            abandonedAt: new Date().toISOString(),
          });
          message.success('任务已放弃');
          await refreshData();
        } catch (error) {
          console.error('放弃失败:', error);
          message.error('放弃失败');
        }
      },
    });
  };

  // 删除任务
  const handleDelete = () => {
    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后将无法恢复，如果任务下有子任务，将一并删除，是否继续？',
      onOk: async () => {
        try {
          await TaskService.delete(task.id);
          message.success('删除成功');
          // 删除后跳转回任务列表
          window.history.back();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 渲染操作菜单
  const renderActionMenu = () => (
    <Menu>
      <Menu.Item key="edit">
        <IconEdit /> 编辑
      </Menu.Item>
      <Menu.Item key="abandon" onClick={handleAbandon}>
        <IconClose /> 放弃
      </Menu.Item>
      <Menu.Item key="delete" onClick={handleDelete} className="text-red-500">
        <IconDelete /> 删除
      </Menu.Item>
    </Menu>
  );

  // 获取主要按钮
  const getPrimaryButton = () => {
    switch (task.status) {
      case TaskStatus.TODO:
      case TaskStatus.DOING:
        return (
          <Button type="primary" icon={<IconCheck />} onClick={handleComplete}>
            标记完成
          </Button>
        );
      case TaskStatus.DONE:
      case TaskStatus.ABANDONED:
        return (
          <Button type="primary" onClick={handleRestore}>
            恢复任务
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <FlexibleContainer>
      {/* 头部 */}
      <Fixed
        direction="vertical"
        className={clsx(
          'px-4 !h-14',
          'border-b border-border-2',
          'justify-between',
        )}
      >
        {/* 左侧：任务名称 */}
        <Shrink className={clsx('flex items-center')}>
          <h2 className="text-lg font-medium text-gray-900 truncate">
            {task.name}
          </h2>
        </Shrink>

        {/* 右侧：状态 Tag + 操作区 */}
        <Fixed className={clsx('flex items-center gap-2')}>
          {/* 状态 Tag（只读） */}
          <Tag color={STATUS_CONFIG[task.status]?.color}>
            {STATUS_CONFIG[task.status]?.label}
          </Tag>

          {/* ... 下拉菜单 */}
          <Dropdown
            dropdownRender={() => renderActionMenu()}
            placement="bottomRight"
          >
            <Button type="text" icon={<IconMore />} />
          </Dropdown>

          {/* 主要按钮 */}
          {getPrimaryButton()}
        </Fixed>
      </Fixed>

      {/* 内容区域 */}
      <Shrink className={clsx('flex flex-col overflow-auto')}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="h-full"
          items={[
            {
              key: 'overview',
              label: '概览',
              children: (
                <div className="p-4">
                  <div className="space-y-4">
                    {/* 基础信息 */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        基础信息
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">任务名称：</span>
                          <span className="text-gray-900">{task.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">状态：</span>
                          <Tag
                            color={STATUS_CONFIG[task.status]?.color}
                            size="small"
                          >
                            {STATUS_CONFIG[task.status]?.label}
                          </Tag>
                        </div>
                        {task.description && (
                          <div className="col-span-2">
                            <span className="text-gray-500">描述：</span>
                            <p className="text-gray-900 mt-1">
                              {task.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 时间信息 */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        时间信息
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {task.startAt && (
                          <div>
                            <span className="text-gray-500">开始时间：</span>
                            <span className="text-gray-900">
                              {new Date(task.startAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {task.endAt && (
                          <div>
                            <span className="text-gray-500">结束时间：</span>
                            <span className="text-gray-900">
                              {new Date(task.endAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'subtasks',
              label: '子任务',
              children: (
                <div className="p-4">
                  <div className="text-center text-gray-500 py-8">
                    子任务功能开发中...
                  </div>
                </div>
              ),
            },
            {
              key: 'todos',
              label: '关联待办',
              children: (
                <div className="p-4">
                  <div className="text-center text-gray-500 py-8">
                    关联待办功能开发中...
                  </div>
                </div>
              ),
            },
            {
              key: 'tracktime',
              label: '时间追踪',
              children: (
                <div className="p-4">
                  <div className="text-center text-gray-500 py-8">
                    <Button type="primary">跳转到计时器</Button>
                  </div>
                </div>
              ),
            },
            {
              key: 'activity',
              label: '活动记录',
              children: (
                <div className="p-4">
                  <div className="text-center text-gray-500 py-8">
                    活动记录功能开发中...
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Shrink>
    </FlexibleContainer>
  );
};

export default TaskMain;
