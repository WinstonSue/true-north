import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { TrackTime as TrackTimeVO, ResponseListVo } from '@true-north/vo';
import { TrackTimeController as _TrackTimeController } from './track-time.route-controller';
import { trackTimeService } from './track-time.service';
import { TodoRelatedType } from '@true-north/enum';

@Controller('/trackTime')
export class TrackTimeController {
  private readonly controller: any = new _TrackTimeController(trackTimeService);

  @Post('/create')
  async create(@Body() createTrackTimeVo: TrackTimeVO.CreateTrackTimeVo): Promise<TrackTimeVO.TrackTimeVo> {
    return this.controller.create(createTrackTimeVo);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.controller.delete(id);
  }

  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackTimeVo: TrackTimeVO.UpdateTrackTimeVo
  ): Promise<TrackTimeVO.TrackTimeVo> {
    return this.controller.update(id, updateTrackTimeVo);
  }

  @Get('/related/:relatedType/:relatedId')
  async findByRelatedId(
    @Param('relatedType') relatedType: string,
    @Param('relatedId') relatedId: string
  ): Promise<ResponseListVo<TrackTimeVO.TrackTimeWithoutRelationsVo>> {
    return this.controller.findByRelatedId(relatedType, relatedId);
  }

  @Delete('/related/:relatedType/:relatedId')
  async deleteByRelatedId(
    @Param('relatedType') relatedType: string,
    @Param('relatedId') relatedId: string
  ): Promise<void> {
    return this.controller.deleteByRelatedId(relatedType, relatedId);
  }

  @Get('/find/:id')
  async find(@Param('id') id: string): Promise<TrackTimeVO.TrackTimeVo | null> {
    return this.controller.find(id);
  }
}
