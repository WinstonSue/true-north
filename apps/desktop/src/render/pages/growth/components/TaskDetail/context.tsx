'use client';

import { useState, useEffect, Dispatch, useRef, useCallback } from 'react';
import type {
  TaskVo,
  UpdateTaskVo,
  GoalWithoutRelationsVo,
  TaskWithoutRelationsVo,
  CreateTaskVo,
} from '@true-north/vo';
import {
  TaskFormData,
  TaskService,
  TaskMapping,
  GoalService,
} from '@true-north/web-service';
import { createInjectState } from '@/utils/createInjectState';

export type TaskDetailContextProps = {
  children: React.ReactNode;
  task?: TaskVo | TaskWithoutRelationsVo;
  initialFormData?: Partial<TaskFormData>;
  mode: 'editor' | 'creator';
  size?: 'small' | 'default';
  afterSubmit?: () => Promise<void>;
};

export const [TaskDetailProvider, useTaskDetailContext] = createInjectState<{
  PropsType: TaskDetailContextProps;
  ContextType: {
    currentTask: TaskVo;
    taskFormData: TaskFormData;
    goalList: GoalWithoutRelationsVo[];
    taskList: TaskWithoutRelationsVo[];
    loading: boolean;
    size: 'small' | 'default';
    setTaskFormData: Dispatch<React.SetStateAction<TaskFormData>>;
    showSubTask: (id: string) => Promise<void>;
    refreshTaskDetail: (id: string) => Promise<void>;
    onSubmit: () => Promise<void>;
  };
}>((props) => {
  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskVo>();

  const defaultFormData: TaskFormData = {
    name: '',
    planTimeRange: [undefined, undefined],
    children: [],
    trackTimeList: [],
    isSubTask: false,
    ...props.initialFormData,
  };

  const [taskFormData, setTaskFormData] =
    useState<TaskFormData>(defaultFormData);

  // TODO: 需要重新实现 useTaskList hook
  const taskList = [];

  // TODO: 需要重新实现 useGoalList hook
  const goalList = [];

  const showSubTask = async (id: string) => {
    await refreshTaskDetail(id);
  };

  const refreshTaskDetail = async (id: string) => {
    const task = await TaskService.find(id);
    setCurrentTask(task);
    setTaskFormData(TaskMapping.voToFormData(task));
  };

  const initTaskFormData = useCallback(async () => {
    await refreshTaskDetail(props.task.id);
  }, [props.task]);

  useEffect(() => {
    async function init() {
      if (props.mode === 'editor') {
        setLoading(true);
        await initTaskFormData();
        setLoading(false);
      }
    }
    init();
  }, [props.mode, initTaskFormData]);

  async function handleCreate(createTaskVo: CreateTaskVo) {
    if (!taskFormData.name) {
      return;
    }
    await TaskService.create(createTaskVo);
    setTaskFormData(defaultFormData);
  }

  async function handleUpdate(data: Partial<UpdateTaskVo>) {
    await TaskService.update(currentTask.id, data);
  }

  const onSubmit = async () => {
    if (props.mode === 'creator') {
      await handleCreate(TaskMapping.formDataToCreateVo(taskFormData));
    } else {
      await handleUpdate(TaskMapping.formDataToUpdateVo(taskFormData));
    }
    await props.afterSubmit?.();
  };

  return {
    currentTask,
    taskFormData,
    goalList,
    taskList,
    setTaskFormData,
    showSubTask,
    refreshTaskDetail,
    onSubmit,
    loading,
    size: props.size || 'default',
  };
});
