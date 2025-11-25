import { TrackTimeService as _TrackTimeService } from '@true-north/business-server';
import { TrackTimeRepository } from './track-time.repository';

export class TrackTimeService extends _TrackTimeService {
  constructor() {
    super(new TrackTimeRepository());
  }
}

export const trackTimeService = new TrackTimeService();
