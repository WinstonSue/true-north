import type { Habit as HabitVO, ResponseListVo, ResponsePageVo } from '@true-north/vo';
import { request } from '@true-north/share-request';

export default class HabitController {
  static async create(body: HabitVO.CreateHabitVo) {
    return request<HabitVO.HabitVo>({ method: "post" })(`/habit/create`, body);
  }

  static async delete(id: string) {
    return request<void>({ method: "remove" })(`/habit/delete/${id}`);
  }

  static async update(id: string, body: HabitVO.UpdateHabitVo) {
    return request<HabitVO.HabitVo>({ method: "put" })(`/habit/update/${id}`, body);
  }

  static async find(id: string) {
    return request<HabitVO.HabitVo>({ method: "get" })(`/habit/find/${id}`);
  }
  static async page(params: HabitVO.HabitPageFilterVo) {
    return request<ResponsePageVo<HabitVO.HabitWithoutRelationsVo>>({ method: "get" })(`/habit/page`, params);
  }

  static async abandon(id: string) {
    return request<void>({ method: "put" })(`/habit/abandon/${id}`);
  }

  static async restore(id: string) {
    return request<void>({ method: "put" })(`/habit/restore/${id}`);
  }

  static async findByFilter(params: HabitVO.HabitFilterVo) {
    return request<ResponseListVo<HabitVO.HabitWithoutRelationsVo>>({ method: "get" })(`/habit/find-by-filter`, params);
  }
}
