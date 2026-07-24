'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Empty, Spin, Message } from '@arco-design/web-react';
import { TaskService } from '@true-north/web-service';
import { TaskVo } from '@true-north/vo';
import TaskAside from './TaskAside';
import TaskMain from './TaskMain';
import { TaskDetailProvider } from './context';
import clsx from 'clsx';

const { Sider, Content } = Layout;

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState<TaskVo | null>(null);
  const [loading, setLoading] = useState(true);

  // 从 Goal 页面跳转时的状态
  const fromGoal = location.state?.fromGoal;

  // 获取任务详情
  const fetchTaskDetail = async (taskId: string) => {
    try {
      setLoading(true);
      const task = await TaskService.find(taskId);
      setCurrentTask(task);
    } catch (error) {
      console.error('获取任务详情失败:', error);
      Message.error('获取任务详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    if (id) {
      await fetchTaskDetail(id);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetail(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size={40} />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="flex items-center justify-center h-full">
        <Empty description="任务不存在或已被删除" />
      </div>
    );
  }

  return (
    <TaskDetailProvider
      taskId={currentTask.id}
      fromGoal={fromGoal}
      onRefresh={refreshData}
    >
      <Layout
        className={clsx(
          'w-full h-full',
          'rounded',
          'bg-bg-2',
          'overflow-hidden',
        )}
      >
        {/* 左侧任务树 */}
        <Sider
          width={320}
          className={clsx('min-w-[200px] max-w-[400px]')}
          theme="light"
          resizeBoxProps={{
            directions: ['right'],
          }}
        >
          <TaskAside currentTaskId={currentTask.id} />
        </Sider>

        {/* 右侧详情面板 */}
        <Content>
          <TaskMain task={currentTask} />
        </Content>
      </Layout>
    </TaskDetailProvider>
  );
};

export default TaskDetailPage;
