import { TaskController } from '@life-toolkit/api';
import type {
  CreateTaskVo,
  TaskPageFilterVo,
  TaskFilterVo,
  TaskWithoutRelationsVo,
  UpdateTaskVo,
} from '@life-toolkit/vo';
import { useState, useEffect } from 'react';
import { Message } from '../message';

export default class TaskService {
  static async getDetail(taskId: string) {
    try {
      const res = await TaskController.find(taskId);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async doneBatchTask(params: TaskFilterVo) {
    try {
      // Task 模块暂时没有批量操作方法，需要逐个处理
      const results = await Promise.all(params.includeIds?.map((id) => TaskController.abandon(id)) || []);
      Message.success('操作成功');
      return results;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async restoreTask(id: string) {
    try {
      const res = await TaskController.restore(id);
      Message.success('操作成功');
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async abandon(id: string) {
    try {
      const res = await TaskController.abandon(id);
      Message.success('操作成功');
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async create(task: CreateTaskVo) {
    try {
      const res = await TaskController.create(task);
      Message.success('操作成功');
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async delete(id: string) {
    try {
      const res = await TaskController.delete(id);
      Message.success('操作成功');
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async update(id: string, task: UpdateTaskVo, silent = true) {
    try {
      const res = await TaskController.update(id, task);
      if (!silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async getList(params: TaskFilterVo) {
    try {
      return TaskController.findByFilter(params);
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async getPage(params: TaskPageFilterVo) {
    try {
      return TaskController.page(params);
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static useTaskList = (params: TaskFilterVo) => {
    const [taskList, setTaskList] = useState<TaskWithoutRelationsVo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTaskList = async () => {
      setLoading(true);
      const res = await TaskService.getList(params);
      setTaskList(res?.list || []);
      setLoading(false);
    };

    useEffect(() => {
      fetchTaskList();
    }, []);

    return { taskList, loading };
  };
}
