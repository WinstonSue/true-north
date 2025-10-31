import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { Task as TaskVO } from '@life-toolkit/vo';
import { TaskController as _TaskController } from '@life-toolkit/business-server';
import { taskService } from './task.service';

@Controller('/task')
export class TaskController {
    private readonly controller = new _TaskController(taskService);
  @Post('/create')
  async create(@Body() createTaskVo: TaskVO.CreateTaskVo) {
    return this.controller.create(createTaskVo);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() body: TaskVO.UpdateTaskVo) {
    return this.controller.update(id, body);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string) {
    return this.controller.find(id);
  }

  @Get('/find-by-filter')
  async findByFilter(@Query() taskListFiltersVo?: TaskVO.TaskFilterVo) {
    return this.controller.findByFilter(taskListFiltersVo);
  }

  @Get('/page')
  async page(@Query() taskPageFiltersVo?: TaskVO.TaskPageFilterVo) {
    return this.controller.page(taskPageFiltersVo);
  }

  @Get('/task-with-relations/:id')
  async taskWithRelations(@Param('id') id: string) {
    return this.controller.taskWithRelations(id);
  }

  @Put('/abandon/:id')
  async abandon(@Param('id') id: string) {
    return this.controller.abandon(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return this.controller.restore(id);
  }
}
