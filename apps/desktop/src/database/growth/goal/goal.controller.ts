import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { Goal as GoalVO, ResponseListVo, ResponsePageVo, ResponseTreeVo } from '@true-north/vo';
import { GoalController as _GoalController } from '@true-north/business-server';
import { goalService } from './goal.service';

@Controller('/goal')
export class GoalController {
  private readonly controller = new _GoalController(goalService);

  @Post('/create')
  async create(@Body() body: GoalVO.CreateGoalVo): Promise<GoalVO.GoalVo> {
    return this.controller.create(body);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateGoalVo: GoalVO.UpdateGoalVo): Promise<GoalVO.GoalVo> {
    return this.controller.update(id, updateGoalVo);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string): Promise<GoalVO.GoalVo> {
    return this.controller.find(id);
  }

  @Get('/find-with-relations/:id')
  async findWithRelations(@Param('id') id: string): Promise<GoalVO.GoalVo> {
    return this.controller.findWithRelations(id);
  }

  @Get('/list')
  async findByFilter(
    @Query() goalListFiltersVo?: GoalVO.GoalFilterVo
  ): Promise<ResponseListVo<GoalVO.GoalWithoutRelationsVo>> {
    return this.controller.findByFilter(goalListFiltersVo);
  }

  @Get('/page')
  async page(
    @Query() goalPageFilterVo?: GoalVO.GoalPageFilterVo
  ): Promise<ResponsePageVo<GoalVO.GoalWithoutRelationsVo>> {
    return this.controller.page(goalPageFilterVo);
  }

  @Get('/get-tree')
  async getTree(@Query() goalListFiltersVo?: GoalVO.GoalFilterVo): Promise<ResponseTreeVo<GoalVO.GoalVo>> {
    return this.controller.getTree(goalListFiltersVo);
  }

  @Get('/find-roots')
  async findRoots(): Promise<GoalVO.GoalVo[]> {
    return this.controller.findRoots();
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
