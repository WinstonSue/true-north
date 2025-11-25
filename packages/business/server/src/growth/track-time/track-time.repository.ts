import { BaseRepository } from '@business/common';
import { TrackTime } from './entity';
import { TrackTimeFilterDto } from './dto';

export interface TrackTimeRepository extends BaseRepository<TrackTime, TrackTimeFilterDto> {
  findByRelatedId(relatedType: string, relatedId: string): Promise<TrackTime[]>;
  deleteByRelatedId(relatedType: string, relatedId: string): Promise<void>;
  findByRelatedIds(relatedType: string, relatedIds: string[]): Promise<TrackTime[]>;
  deleteByRelatedIds(relatedType: string, relatedIds: string[]): Promise<void>;
}
