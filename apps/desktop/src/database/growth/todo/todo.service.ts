import { TodoService as _TodoService } from '@true-north/business-server';
import { TodoRepository } from './todo.repository';
import { TodoRepeatRepository } from './todo-repeat.repository';
import { TodoRepeatService as _TodoRepeatService } from '@true-north/business-server';

export class TodoRepeatService extends _TodoRepeatService {
  constructor() {
    super(new TodoRepeatRepository());
  }
}

export const todoRepeatService = new TodoRepeatService();

export class TodoService extends _TodoService {
  constructor() {
    const todoRepository = new TodoRepository();
    const todoRepeatRepository = new TodoRepeatRepository();
    super(todoRepository, todoRepeatRepository);
  }
}

export const todoService = new TodoService();
