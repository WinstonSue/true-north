import { TodoController } from '@true-north/api';
import type { Todo as TodoVO } from '@true-north/vo';
import { Message } from '../message';
import { MethodOptions } from '../type';

export default class TodoService {
  static async create(body: TodoVO.CreateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.create(body);
      if (!options?.silent) {
        Message.success('创建成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

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

  static async update(id: string, body: TodoVO.UpdateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.update(id, body);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async find(id: string) {
    try {
      const res = await TodoController.find(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async findByFilter(query?: TodoVO.TodoFilterVo) {
    try {
      const res = await TodoController.findByFilter(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async page(query?: TodoVO.TodoPageFilterVo) {
    try {
      const res = await TodoController.page(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async updateWithRepeat(id: string, body: TodoVO.UpdateTodoVo, options?: MethodOptions) {
    try {
      const res = await TodoController.updateWithRepeat(id, body);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async doneWithRepeatBatch(query?: TodoVO.TodoFilterVo, body?: any, options?: MethodOptions) {
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

  static async findMixRepeat(id: string, query?: { relatedType?: string }) {
    try {
      const res = await TodoController.findMixRepeat(id, query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async deleteWithRepeat(id: string, query?: TodoVO.TodoFilterVo, options?: MethodOptions) {
    try {
      const res = await TodoController.deleteWithRepeat(id, query);
      if (!options?.silent) {
        Message.success('删除成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  static async listMixRepeatByQuery(query?: TodoVO.TodoFilterVo) {
    try {
      const res = await TodoController.listMixRepeatByQuery(query);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }
}
