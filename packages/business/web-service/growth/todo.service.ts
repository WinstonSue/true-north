import { TodoController } from '@life-toolkit/api';
import type { CreateTodoVo, TodoPageFilterVo, TodoFilterVo, UpdateTodoVo } from '@life-toolkit/vo';
import { Message } from '../message';
import { MethodOptions } from '../type';

export default class TodoService {
  /**
   * 获取单个任务
   * @param todoId 任务ID
   * @returns 任务详情
   */
  static async findMixRepeat(todoId: string, { source }: { source?: string } = {}) {
    try {
      return TodoController.findMixRepeat(todoId, { source });
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 批量完成任务
   * @param params 任务ID列表
   * @returns 操作结果
   */
  static async doneBatchWithRepeat(params: TodoFilterVo, options: MethodOptions) {
    try {
      const res = await TodoController.doneWithRepeatBatch(params);
      if (options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 恢复任务
   * @param id 任务ID
   * @returns 操作结果
   */
  static async restoreWithRepeat(id: string, options: MethodOptions) {
    try {
      const res = await TodoController.restoreWithRepeat(id);
      if (options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 放弃任务
   * @param id 任务ID
   * @returns 操作结果
   */
  static async abandonWithRepeat(id: string, options: MethodOptions) {
    try {
      const res = await TodoController.abandonWithRepeat(id);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 添加任务
   * @param todo 任务详情
   * @returns 操作结果
   */
  static async create(todo: CreateTodoVo, options: MethodOptions) {
    try {
      const res = await TodoController.create(todo);
      if (!options.silent) {
        Message.success('创建成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 删除任务
   * @param id 任务ID
   * @returns 操作结果
   */
  static async delete(id: string, options: MethodOptions) {
    try {
      const res = await TodoController.delete(id);
      if (!options.silent) {
        Message.success('删除成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 更新任务
   * @param id 任务ID
   * @param todo 任务详情
   * @param silent 是否静默
   * @returns 操作结果
   */
  static async update(id: string, todo: UpdateTodoVo, options: MethodOptions) {
    try {
      const res = await TodoController.update(id, todo);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 更新待办及重复待办
   * @param id 待办ID
   * @param todo 待办详情
   * @param silent 是否静默
   * @returns 操作结果
   */
  static async updateWithRepeat(id: string, todo: UpdateTodoVo, options: MethodOptions) {
    try {
      const res = await TodoController.updateWithRepeat(id, todo);
      if (!options.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 获取任务列表
   * @param params 任务列表过滤条件
   * @returns 任务列表
   */
  static async listMixRepeat(params: TodoFilterVo = {}) {
    try {
      return TodoController.listMixRepeat(params);
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * 获取任务分页列表
   * @param params 任务分页过滤条件
   * @returns 任务分页列表
   */
  static async page(params: TodoPageFilterVo) {
    try {
      return TodoController.page(params);
    } catch (error: unknown) {
      Message.error(error);
    }
  }
}
