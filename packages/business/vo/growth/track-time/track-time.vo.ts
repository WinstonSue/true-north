import { BaseEntityVo } from '../../common';

export type TrackTimeWithoutRelationsVo = {
  relatedType?: string;
  relatedId?: string;
  startAt?: string;
  endAt?: string;
  duration?: number;
  notes?: string;
} & BaseEntityVo;

export type TrackTimeVo = TrackTimeWithoutRelationsVo;
