import { HabitController } from '@life-toolkit/api';
import type { CreateHabitVo, UpdateHabitVo, HabitFilterVo, HabitPageFilterVo } from '@life-toolkit/vo';
import { Message } from '../message';

export default class HabitService {
  static async create(params: CreateHabitVo) {
    try {
      const res = await HabitController.create(params);
      Message.success('创建习惯成功');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }

  static async update(id: string, params: UpdateHabitVo) {
    try {
      const res = await HabitController.update(id, params);
      Message.success('更新习惯成功');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }

  static async getDetail(id: string) {
    try {
      return await HabitController.find(id);
    } catch (error) {
      Message.error(error);
    }
  }

  static async getList(filter: HabitFilterVo ) {
    try {
      return await HabitController.findByFilter(filter);
    } catch (error) {
      Message.error(error);
    }
  }

  static async getPage(filter: HabitPageFilterVo) {
    try {
      return await HabitController.page(filter);
    } catch (error) {
      Message.error(error);
    }
  }

  static async delete(id: string) {
    try {
      const res = await HabitController.delete(id);
      Message.success('删除习惯成功');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }

  static async abandon(id: string) {
    try {
      const res = await HabitController.abandon(id);
      Message.success('已放弃该习惯');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }

  static async restore(id: string) {
    try {
      const res = await HabitController.restore(id);
      Message.success('已恢复该习惯');
      return res;
    } catch (error) {
      Message.error(error);
    }
  }
}
