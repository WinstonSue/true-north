import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import { ResponseListVo, ResponsePageVo, type Habit as HabitVO } from '@life-toolkit/vo';
import { HabitController as _HabitController } from '@life-toolkit/business-server';
import { habitService } from './habit.service';
@Controller('/habit')
export class HabitController {
  private readonly controller = new _HabitController(habitService);

  @Post('/create')
  async create(@Body() createHabitVo: HabitVO.CreateHabitVo): Promise<HabitVO.HabitVo> {
    return this.controller.create(createHabitVo);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateHabitVo: HabitVO.UpdateHabitVo): Promise<HabitVO.HabitVo> {
    return this.controller.update(id, updateHabitVo);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string): Promise<HabitVO.HabitVo> {
    return this.controller.find(id);
  }

  @Get('/find-by-filter')
  async findByFilter(
    @Query() habitListFiltersVo?: HabitVO.HabitFilterVo
  ): Promise<ResponseListVo<HabitVO.HabitWithoutRelationsVo>> {
    return this.controller.findByFilter(habitListFiltersVo);
  }

  @Get('/page')
  async page(
    @Query() habitPageFilterVo?: HabitVO.HabitPageFilterVo
  ): Promise<ResponsePageVo<HabitVO.HabitWithoutRelationsVo>> {
    return this.controller.page(habitPageFilterVo);
  }

  @Put('/abandon/:id')
  async abandon(@Param('id') id: string): Promise<void> {
    return this.controller.abandon(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string): Promise<void> {
    return this.controller.restore(id);
  }
}
