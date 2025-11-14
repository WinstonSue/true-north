import { GoalController } from '@true-north/api';
import type { Goal as GoalVO } from '@true-north/vo';
import { Message } from '../message';
import { MethodOptions } from '../type';

export default class GoalService {
  /**
   * create
   * @param body 请求体数据
   * @returns 操作结果
   */
  static async create(body: GoalVO.CreateGoalVo, options?: MethodOptions) {
    try {
      const res = await GoalController.create(body);
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
      const res = await GoalController.delete(id);
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
   * @param updateGoalVo 请求体数据
   * @returns 操作结果
   */
  static async update(id: string, updateGoalVo: GoalVO.UpdateGoalVo, options?: MethodOptions) {
    try {
      const res = await GoalController.update(id, updateGoalVo);
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
      const res = await GoalController.find(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findWithRelations
   * @param id idID
   * @returns 操作结果
   */
  static async findWithRelations(id: string) {
    try {
      const res = await GoalController.findWithRelations(id);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findByFilter
   * @param goalListFiltersVo 查询参数
   * @returns 操作结果
   */
  static async findByFilter(goalListFiltersVo?: GoalVO.GoalFilterVo) {
    try {
      const res = await GoalController.findByFilter(goalListFiltersVo);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * page
   * @param goalPageFilterVo 查询参数
   * @returns 操作结果
   */
  static async page(goalPageFilterVo?: GoalVO.GoalPageFilterVo) {
    try {
      const res = await GoalController.page(goalPageFilterVo);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * getTree
   * @param goalListFiltersVo 查询参数
   * @returns 操作结果
   */
  static async getTree(goalListFiltersVo?: GoalVO.GoalFilterVo) {
    try {
      const res = await GoalController.getTree(goalListFiltersVo);
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }

  /**
   * findRoots
   * @returns 操作结果
   */
  static async findRoots() {
    try {
      const res = await GoalController.findRoots();
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
  static async abandon(id: string, options?: MethodOptions) {
    try {
      const res = await GoalController.abandon(id);
      if (!options?.silent) {
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
  static async restore(id: string, options?: MethodOptions) {
    try {
      const res = await GoalController.restore(id);
      if (!options?.silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error: unknown) {
      Message.error(error);
    }
  }
}
