import { request } from '@true-north/share-request';
import { Todo as TodoVO, ResponseListVo, ResponsePageVo } from '@true-north/vo';

export default class TodoController {
  static async create(body: TodoVO.CreateTodoVo) {
    return request<TodoVO.TodoVo>({ method: 'post' })(`/todo/create`, body);
  }

  static async delete(id: string) {
    return request<boolean>({ method: 'remove' })(`/todo/delete/${id}`);
  }

  static async update(id: string, body: TodoVO.UpdateTodoVo) {
    return request<TodoVO.TodoVo>({ method: 'put' })(`/todo/update/${id}`, body);
  }

  static async find(id: string) {
    return request<TodoVO.TodoVo>({ method: 'get' })(`/todo/find/${id}`);
  }

  static async page(query?: TodoVO.TodoPageFilterVo) {
    return request<ResponsePageVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/page`, query);
  }

  static async updateWithRepeat(id: string, body: TodoVO.UpdateTodoVo) {
    return request<TodoVO.TodoVo>({ method: 'put' })(`/todo/update-with-repeat/${id}`, body);
  }

  static async doneWithRepeatBatch(query?: TodoVO.TodoFilterVo, body?: any) {
    return request<any>({ method: 'put' })(
      `/todo/done-with-repeat/batch?${new URLSearchParams(query as any).toString()}`,
      body
    );
  }

  static async restoreWithRepeat(id: string) {
    return request<boolean>({ method: 'put' })(`/todo/restore-with-repeat/${id}`);
  }

  static async findMixRepeat(id: string, query?: { source?: string }) {
    return request<TodoVO.TodoVo>({ method: 'get' })(`/todo/find-mix-repeat/${id}`, query);
  }

  static async findByFilter(query?: TodoVO.TodoFilterVo) {
    return request<ResponseListVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/find-by-filter`, query);
  }

  static async abandonWithRepeat(id: string) {
    return request<boolean>({ method: 'put' })(`/todo/abandon-with-repeat${id}`);
  }

  static async listMixRepeatByQuery(query?: TodoVO.TodoFilterVo) {
    return request<ResponseListVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/list-mixed-repeat`, query);
  }
}
