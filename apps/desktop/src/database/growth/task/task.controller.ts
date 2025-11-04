import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import { TaskController as _TaskController } from '@life-toolkit/business-server';
import { taskService } from './task.service';
import { ResponseListVo, ResponsePageVo, type Task as TaskVO } from '@life-toolkit/vo';

@Controller('/task')
export class TaskController {
  private readonly controller = new _TaskController(taskService);

  @Post('/create')
  async create(@Body() createTaskVo: TaskVO.CreateTaskVo): Promise<TaskVO.TaskVo> {
    return this.controller.create(createTaskVo);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() body: TaskVO.UpdateTaskVo): Promise<TaskVO.TaskVo> {
    return this.controller.update(id, body);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string): Promise<TaskVO.TaskVo> {
    return this.controller.find(id);
  }

  @Get('/find-by-filter')
  async findByFilter(
    @Query() taskListFiltersVo?: TaskVO.TaskFilterVo
  ): Promise<ResponseListVo<TaskVO.TaskWithoutRelationsVo>> {
    return this.controller.findByFilter(taskListFiltersVo);
  }

  @Get('/page')
  async page(
    @Query() taskPageFilterVo?: TaskVO.TaskPageFilterVo
  ): Promise<ResponsePageVo<TaskVO.TaskWithoutRelationsVo>> {
    return this.controller.page(taskPageFilterVo);
  }

  @Get('/task-with-relations/:id')
  async taskWithRelations(@Param('id') id: string): Promise<TaskVO.TaskVo> {
    return this.controller.taskWithRelations(id);
  }

  @Put('/abandon/:id')
  async abandon(@Param('id') id: string): Promise<boolean> {
    return this.controller.abandon(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string): Promise<boolean> {
    return this.controller.restore(id);
  }
}
