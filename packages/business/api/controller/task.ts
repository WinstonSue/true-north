import { request } from '@life-toolkit/share-request';
import { Task as TaskVO, ResponsePageVo, ResponseListVo } from '@life-toolkit/vo';

export default class TaskController {
  static async create(body: TaskVO.CreateTaskVo) {
    return request<TaskVO.TaskVo>({ method: "post" })(`/task/create`, body);
  }

  static async delete(id: string) {
    return request<boolean>({ method: "remove" })(`/task/delete/${id}`);
  }

  static async update(id: string, body: TaskVO.UpdateTaskVo) {
    return request<TaskVO.TaskVo>({ method: "put" })(`/task/update/${id}`, body);
  }

  static async find(id: string) {
    return request<TaskVO.TaskVo>({ method: "get" })(`/task/find/${id}`);
  }
  static async page(params: TaskVO.TaskPageFilterVo) {
    return request<ResponsePageVo<TaskVO.TaskWithoutRelationsVo>>({ method: "get" })(`/task/page`, params);
  }

  static async taskWithRelations(id: string) {
    return request<TaskVO.TaskVo>({ method: "get" })(`/task/task-with-relations/${id}`);
  }

  static async abandon(id: string) {
    return request<boolean>({ method: "put" })(`/task/abandon/${id}`);
  }

  static async restore(id: string) {
    return request<boolean>({ method: "put" })(`/task/restore/${id}`);
  }

  static async findByFilter(params: TaskVO.TaskFilterVo) {
    return request<ResponseListVo<TaskVO.TaskWithoutRelationsVo>>({ method: "get" })(`/task/find-by-filter`, params);
  }
}
