import { TrackTimeVo } from './track-time.vo';
import { BaseFilterVo } from '../../common';

export type TrackTimeFilterVo = {
  startAtStart?: string;
  startAtEnd?: string;
  endAtStart?: string;
  endAtEnd?: string;
  minDuration?: number;
  maxDuration?: number;
  id?: string;
} & BaseFilterVo &
  Partial<Pick<TrackTimeVo, 'relatedType' | 'relatedId'>>;

export type TrackTimePageFilterVo = TrackTimeFilterVo & {
  pageNum: number;
  pageSize: number;
};
