import { GoalController } from '@life-toolkit/api';
import type {
  CreateGoalVo,
  GoalPageFilterVo,
  GoalFilterVo,
  UpdateGoalVo,
  GoalWithoutRelationsVo,
} from '@life-toolkit/vo';
import { useState, useEffect } from 'react';
import { Message } from '../message';

export default class GoalService {
  static async find(todoId: string) {
    try {
      return GoalController.find(todoId);
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async restore(id: string) {
    try {
      const res = await GoalController.restore(id);
      Message.success('操作成功');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }

  static async abandon(id: string) {
    try {
      const res = await GoalController.abandon(id);
      Message.success('操作成功');
      return res;
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async create(goal: CreateGoalVo) {
    try {
      const res = await GoalController.create(goal);
      Message.success('操作成功');
      return res;
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async delete(id: string) {
    try {
      const res = await GoalController.delete(id);
      Message.success('操作成功');
      return res;
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async update(id: string, goal: UpdateGoalVo, silent = true) {
    try {
      const res = await GoalController.update(id, goal);
      if (!silent) {
        Message.success('操作成功');
      }
      return res;
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async findByFilter(params: GoalFilterVo = {}) {
    try {
      return GoalController.findByFilter(params);
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async getTree(params: GoalFilterVo = {}) {
    try {
      return GoalController.getTree(params);
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static async getPage(params: GoalPageFilterVo) {
    try {
      return GoalController.page(params);
    } catch (error) {
      Message.error(error);
      throw error;
    }
  }

  static useGoalList = (params: GoalFilterVo = {}) => {
    const [goalList, setGoalList] = useState<GoalWithoutRelationsVo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGoalList = async () => {
      setLoading(true);
      const res = await GoalService.findByFilter(params);
      setGoalList(res.list);
      setLoading(false);
    };

    useEffect(() => {
      fetchGoalList();
    }, []);

    return { goalList, loading };
  };
}
