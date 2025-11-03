import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { Todo as TodoVO, ResponseListVo, ResponsePageVo } from '@life-toolkit/vo';
import { TodoController as _TodoController } from '@life-toolkit/business-server';
import { todoService, todoRepeatService } from './todo.service';

@Controller('/todo')
export class TodoController {
  private readonly controller = new _TodoController(todoService, todoRepeatService);

  @Post('/create')
  async create(@Body() createTodoVo: TodoVO.CreateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.create(createTodoVo);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateVo: TodoVO.UpdateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.update(id, updateVo);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string): Promise<TodoVO.TodoVo> {
    return this.controller.find(id);
  }

  @Get('/find-by-filter')
  async findByFilter(@Query() query?: TodoVO.TodoFilterVo): Promise<ResponseListVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.findByFilter(query);
  }

  @Get('/page')
  async page(@Query() query?: TodoVO.TodoPageFilterVo): Promise<ResponsePageVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.page(query);
  }

  @Put('/update-with-repeat/:id')
  async updateWithRepeat(@Param('id') id: string, @Body() updateVo: TodoVO.UpdateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.updateWithRepeat(id, updateVo);
  }

  @Put('/done-with-repeat/batch')
  async doneWithRepeatBatch(@Query() query: TodoVO.TodoFilterVo, @Body() body: any): Promise<any> {
    return this.controller.doneWithRepeatBatch(query, body);
  }

  @Put('/abandon-with-repeat/:id')
  async abandonWithRepeat(@Param('id') id: string): Promise<boolean> {
    return this.controller.abandonWithRepeat(id);
  }

  @Put('/restore-with-repeat/:id')
  async restoreWithRepeat(@Param('id') id: string): Promise<boolean> {
    return this.controller.restoreWithRepeat(id);
  }

  @Get('/list-mixed-repeat')
  async listMixRepeat(@Query() query?: TodoVO.TodoFilterVo): Promise<ResponseListVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.listMixRepeat(query);
  }

  @Get('/find-mix-repeat/:id')
  async findMixRepeat(@Param('id') id: string, @Query() query?: { source?: string; }): Promise<TodoVO.TodoVo> {
    return this.controller.findMixRepeat(id, query);
  }
}
