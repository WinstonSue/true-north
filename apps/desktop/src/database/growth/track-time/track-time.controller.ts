import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'electron-ipc-restful';
import type { TrackTime as TrackTimeVO, ResponseListVo } from '@true-north/vo';
import { TrackTimeController as _TrackTimeController } from '@true-north/business-server';
import { trackTimeService } from './track-time.service';
import { RelatedType } from '@true-north/enum';

@Controller('/trackTime')
export class TrackTimeController {
  private readonly controller: any = new _TrackTimeController(trackTimeService);

  @Post('/create')
  async create(@Body() body: TrackTimeVO.CreateTrackTimeVo): Promise<TrackTimeVO.TrackTimeVo> {
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
    @Body() body: TrackTimeVO.UpdateTrackTimeVo
  ): Promise<TrackTimeVO.TrackTimeVo> {
    return this.controller.update(relatedType, id, body);
  }

  @Get('/list')
  async list(
    @Query() query?: TrackTimeVO.TrackTimeFilterVo
  ): Promise<ResponseListVo<TrackTimeVO.TrackTimeWithoutRelationsVo>> {
    return this.controller.list(query);
  }
}
