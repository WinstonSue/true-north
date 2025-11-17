import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { Todo as TodoVO, ResponseListVo, ResponsePageVo } from '@true-north/vo';
import { TodoController as _TodoController } from '@true-north/business-server';
import { todoService, todoRepeatService } from './todo.service';
import { RelatedType } from '@true-north/enum';

@Controller('/todo')
export class TodoController {
  private readonly controller: any = new _TodoController(todoService, todoRepeatService);

  @Post('/create')
  async create(@Body() body: TodoVO.CreateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.create(body);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() body: TodoVO.UpdateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.update(id, body);
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
  async updateWithRepeat(@Param('id') id: string, @Body() body: TodoVO.UpdateTodoVo): Promise<TodoVO.TodoVo> {
    return this.controller.updateWithRepeat(id, body);
  }

  @Put('/done-with-repeat/batch')
  async doneWithRepeatBatch(@Query() query?: TodoVO.TodoFilterVo, @Body() body?: any): Promise<any> {
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

  @Delete('/delete-with-repeat/:id')
  async deleteWithRepeat(@Param('id') id: string, @Query() query?: { relatedType?: RelatedType }): Promise<boolean> {
    return this.controller.deleteWithRepeat(id, query);
  }

  @Get('/list-mixed-repeat-by-query')
  async listMixRepeatByQuery(
    @Query() query?: TodoVO.TodoFilterVo
  ): Promise<ResponseListVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.listMixRepeatByQuery(query);
  }

  @Get('/find-mix-repeat/:id')
  async findMixRepeat(@Param('id') id: string, @Query() query?: { relatedType?: RelatedType }): Promise<TodoVO.TodoVo> {
    return this.controller.findMixRepeat(id, query);
  }
}
