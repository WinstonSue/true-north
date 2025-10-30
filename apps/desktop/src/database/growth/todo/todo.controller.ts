import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { Todo as TodoVO } from '@life-toolkit/vo';
import { TodoController as _TodoController } from '@life-toolkit/business-server';
import { todoService, todoRepeatService } from './todo.service';

@Controller('/todo')
export class TodoController {
  private readonly controller = new _TodoController(todoService, todoRepeatService);

  @Post('/create', { description: '创建待办' })
  async create(@Body() body: TodoVO.CreateTodoVo) {
    return this.controller.create(body);
  }

  @Delete('/delete/:id', { description: '删除待办' })
  async delete(@Param('id') id: string) {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() body: TodoVO.UpdateTodoVo) {
    return this.controller.update(id, body);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string) {
    return this.controller.find(id);
  }

  @Get('/find-by-filter')
  async findByFilter(@Query() query?: TodoVO.TodoFilterVo) {
    return this.controller.findByFilter(query);
  }

  @Get('/page')
  async page(@Query() query?: TodoVO.TodoPageFilterVo) {
    return this.controller.page(query);
  }

  @Get('/list-mixed-repeat')
  async listMixRepeat(@Query() query?: TodoVO.TodoFilterVo) {
    return this.controller.listMixRepeat(query);
  }

  @Put('/done-with-repeat/batch')
  async doneWithRepeatBatch(@Body() body: TodoVO.TodoFilterVo) {
    return this.controller.doneWithRepeatBatch(body);
  }

  @Put('/abandon-with-repeat/:id')
  async abandonWithRepeat(@Param('id') id: string) {
    return this.controller.abandonWithRepeat(id);
  }

  @Put('/restore-with-repeat/:id')
  async restoreWithRepeat(@Param('id') id: string) {
    return this.controller.restoreWithRepeat(id);
  }

  @Put('/update-with-repeat/:id')
  async updateWithRepeat(@Param('id') id: string, @Body() body: TodoVO.UpdateTodoVo) {
    return this.controller.updateWithRepeat(id, body);
  }

  @Get('/find-mix-repeat/:id', { description: '查询待办及其重复信息' })
  async findMixRepeat(@Param('id') id: string, @Query() query?: { source?: string }) {
    return this.controller.findMixRepeat(id, query);
  }
}
