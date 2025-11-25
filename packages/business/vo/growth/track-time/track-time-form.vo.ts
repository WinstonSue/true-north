import { TrackTimeWithoutRelationsVo } from './track-time.vo';

export type CreateTrackTimeVo = Pick<
  TrackTimeWithoutRelationsVo,
  'relatedType' | 'relatedId' | 'startAt' | 'endAt' | 'duration' | 'notes'
>;

export type UpdateTrackTimeVo = Partial<CreateTrackTimeVo>;
