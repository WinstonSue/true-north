import { TodoController } from '@true-north/api';
import type { Todo as TodoVO } from '@true-north/vo';
import { Message } from '../message';
import { MethodOptions } from '../type';

export default class TodoService {
  /**
   * create
   * @param createTodoVo 请求体数据
   * @returns 操作结果
   */
  static async create(createTodoVo: TodoVO.CreateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.create(createTodoVo);
      if (!options?.silent) {
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
  static async delete(id: string, options?: MethodOptions) {
    try {
      const res = await TodoController.delete(id);
      if (!options?.silent) {
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
   * @param updateVo 请求体数据
   * @returns 操作结果
   */
  static async update(id: string, updateVo: TodoVO.UpdateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.update(id, updateVo);
      if (!options?.silent) {
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
      const res = await TodoController.find(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findByFilter
   * @param query 查询参数
   * @returns 操作结果
   */
  static async findByFilter(query?: TodoVO.TodoFilterVo) {
    try {
      const res = await TodoController.findByFilter(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * page
   * @param query 查询参数
   * @returns 操作结果
   */
  static async page(query?: TodoVO.TodoPageFilterVo) {
    try {
      const res = await TodoController.page(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * updateWithRepeat
   * @param id idID
   * @param updateVo 请求体数据
   * @returns 操作结果
   */
  static async updateWithRepeat(id: string, updateVo: TodoVO.UpdateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.updateWithRepeat(id, updateVo);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * doneWithRepeatBatch
   * @param query 查询参数
   * @param body 请求体数据
   * @returns 操作结果
   */
  static async doneWithRepeatBatch(query: TodoVO.TodoFilterVo, body: any, options?: MethodOptions) {
    try {
      const res = await TodoController.doneWithRepeatBatch(query, body);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * abandonWithRepeat
   * @param id idID
   * @returns 操作结果
   */
  static async abandonWithRepeat(id: string, options?: MethodOptions) {
    try {
      const res = await TodoController.abandonWithRepeat(id);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * restoreWithRepeat
   * @param id idID
   * @returns 操作结果
   */
  static async restoreWithRepeat(id: string, options?: MethodOptions) {
    try {
      const res = await TodoController.restoreWithRepeat(id);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * listMixRepeat
   * @param query 查询参数
   * @returns 操作结果
   */
  static async listMixRepeat(query?: TodoVO.TodoFilterVo) {
    try {
      const res = await TodoController.listMixRepeat(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findMixRepeat
   * @param id idID
   * @param query 查询参数
   * @returns 操作结果
   */
  static async findMixRepeat(id: string, query?: { source?: string }) {
    try {
      const res = await TodoController.findMixRepeat(id, query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }
}
