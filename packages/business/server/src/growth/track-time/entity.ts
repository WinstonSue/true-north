import { BaseEntity } from '@business/common';

export class TrackTime extends BaseEntity {
  relatedType?: string;

  relatedId?: string;

  startAt?: Date;

  endAt?: Date;

  duration?: number;

  notes?: string;
}
