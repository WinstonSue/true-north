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
  /**
   * create
   * @param createTaskVo 请求体数据
   * @returns 操作结果
   */
  static async create(createTaskVo: TaskVO.CreateTaskVo, options: MethodOptions) {
    try {
      const res = await TaskController.create(createTaskVo);
      if (!options.silent) {
        Message.success('创建成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * delete
   * @param id idID
   * @returns 操作结果
   */
  static async delete(id: string, options: MethodOptions) {
    try {
      const res = await TaskController.delete(id);
      if (!options.silent) {
        Message.success('删除成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * update
   * @param id idID
   * @param body 请求体数据
   * @returns 操作结果
   */
  static async update(id: string, body: TaskVO.UpdateTaskVo, options: MethodOptions) {
    try {
      const res = await TaskController.update(id, body);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * find
   * @param id idID
   * @returns 操作结果
   */
  static async find(id: string) {
    try {
      const res = await TaskController.find(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findByFilter
   * @param taskListFiltersVo 查询参数
   * @returns 操作结果
   */
  static async findByFilter(taskListFiltersVo?: TaskVO.TaskFilterVo) {
    try {
      const res = await TaskController.findByFilter(taskListFiltersVo);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * page
   * @param taskPageFilterVo 查询参数
   * @returns 操作结果
   */
  static async page(taskPageFilterVo?: TaskVO.TaskPageFilterVo) {
    try {
      const res = await TaskController.page(taskPageFilterVo);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * taskWithRelations
   * @param id idID
   * @returns 操作结果
   */
  static async taskWithRelations(id: string) {
    try {
      const res = await TaskController.taskWithRelations(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * abandon
   * @param id idID
   * @returns 操作结果
   */
  static async abandon(id: string, options: MethodOptions) {
    try {
      const res = await TaskController.abandon(id);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * restore
   * @param id idID
   * @returns 操作结果
   */
  static async restore(id: string, options: MethodOptions) {
    try {
      const res = await TaskController.restore(id);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }
}
