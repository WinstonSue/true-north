import { BaseRepository } from '@business/common';
import { TrackTime } from './entity';
import { TrackTimeFilterDto } from './dto';

export interface TrackTimeRepository extends BaseRepository<TrackTime, TrackTimeFilterDto> {
}
