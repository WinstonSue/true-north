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

  @Delete('/delete/:relatedType/:id')
  async delete(@Param('relatedType') relatedType: RelatedType, @Param('id') id: string): Promise<boolean> {
    return this.controller.delete(relatedType, id);
  }

  @Put('/update/:relatedType/:id')
  async update(
    @Param('relatedType') relatedType: RelatedType,
    @Param('id') id: string,
    @Body() body: TodoVO.UpdateTodoVo
  ): Promise<TodoVO.TodoVo> {
    return this.controller.update(relatedType, id, body);
  }

  @Get('/page')
  async page(@Query() query?: TodoVO.TodoPageFilterVo): Promise<ResponsePageVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.page(query);
  }

  @Get('/find/:relatedType/:id')
  async findMixRepeat(@Param('relatedType') relatedType: RelatedType, @Param('id') id: string): Promise<TodoVO.TodoVo> {
    return this.controller.findMixRepeat(relatedType, id);
  }

  @Put('/done/:relatedType/:id')
  async done(
    @Param('relatedType') relatedType: RelatedType,
    @Param('id') id: string,
    @Body() body?: { doneAt?: string }
  ): Promise<any> {
    return this.controller.done(relatedType, id, body);
  }

  @Put('/abandon/:relatedType/:id')
  async abandon(@Param('relatedType') relatedType: RelatedType, @Param('id') id: string): Promise<boolean> {
    return this.controller.abandon(relatedType, id);
  }

  @Put('/restore/:relatedType/:id')
  async restore(@Param('relatedType') relatedType: RelatedType, @Param('id') id: string): Promise<boolean> {
    return this.controller.restore(relatedType, id);
  }

  @Get('/list')
  async list(@Query() query?: TodoVO.TodoFilterVo): Promise<ResponseListVo<TodoVO.TodoWithoutRelationsVo>> {
    return this.controller.list(query);
  }
}
