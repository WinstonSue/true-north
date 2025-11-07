import { request } from '@life-toolkit/share-request';
import { Todo as TodoVO, ResponseListVo, ResponsePageVo } from '@life-toolkit/vo';

export class TodoController {
  create(body: TodoVO.CreateTodoVo): Promise<any> {
    return request<TodoVO.TodoVo>({ method: 'post' })(`/todo/create`, body);
  }

  delete(id: string): Promise<any> {
    return request<boolean>({ method: 'remove' })(`/todo/delete/${id}`);
  }

  update(id: string, body: TodoVO.UpdateTodoVo): Promise<any> {
    return request<TodoVO.TodoVo>({ method: 'put' })(`/todo/update/${id}`, body);
  }

  find(id: string): Promise<any> {
    return request<TodoVO.TodoVo>({ method: 'get' })(`/todo/find/${id}`);
  }

  findByFilter(query?: TodoVO.TodoFilterVo): Promise<any> {
    return request<ResponseListVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/find-by-filter`, query);
  }

  page(query?: TodoVO.TodoPageFilterVo): Promise<any> {
    return request<ResponsePageVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/page`, query);
  }

  updateWithRepeat(id: string, body: TodoVO.UpdateTodoVo): Promise<any> {
    return request<TodoVO.TodoVo>({ method: 'put' })(`/todo/update-with-repeat/${id}`, body);
  }

  doneWithRepeatBatch(query?: TodoVO.TodoFilterVo, body?: any): Promise<any> {
    return request<any>({ method: 'put' })(
      `/todo/done-with-repeat/batch?${new URLSearchParams(query as any).toString()}`,
      body
    );
  }

  abandonWithRepeat(id: string): Promise<any> {
    return request<boolean>({ method: 'put' })(`/todo/abandon-with-repeat/${id}`);
  }

  restoreWithRepeat(id: string): Promise<any> {
    return request<boolean>({ method: 'put' })(`/todo/restore-with-repeat/${id}`);
  }

  listMixRepeat(query?: TodoVO.TodoFilterVo): Promise<any> {
    return request<ResponseListVo<TodoVO.TodoWithoutRelationsVo>>({ method: 'get' })(`/todo/list-mixed-repeat`, query);
  }

  findMixRepeat(id: string, query?: { source?: string }): Promise<any> {
    return request<TodoVO.TodoVo>({ method: 'get' })(`/todo/find-mix-repeat/${id}`, query);
  }
}
