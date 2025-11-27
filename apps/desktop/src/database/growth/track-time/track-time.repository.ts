import { AppDataSource } from '../../database.config';
import { TrackTimeFilterDto, TrackTime } from '@true-north/business-server';
import { TrackTimeRepository as _TrackTimeRepository } from '@true-north/business-server';
import { BaseRepository } from '../../common/base';
import { In } from 'typeorm';

export class TrackTimeRepository extends BaseRepository<TrackTime, TrackTimeFilterDto> implements _TrackTimeRepository {
  constructor() {
    function buildQuery(filter: TrackTimeFilterDto) {
      const qb = this.repo.createQueryBuilder('trackTime');

      if (filter.relatedType !== undefined) {
        qb.andWhere('trackTime.relatedType = :relatedType', { relatedType: filter.relatedType });
      }
      if (filter.relatedId !== undefined) {
        qb.andWhere('trackTime.relatedId = :relatedId', { relatedId: filter.relatedId });
      }

      return qb;
    }

    super(AppDataSource.getRepository(TrackTime), buildQuery);
  }

  async findWithRelations(id: string, relations?: string[]): Promise<TrackTime> {
    const trackTime = await this.repo.findOne({
      where: { id },
      relations: relations || [],
    });
    if (!trackTime) throw new Error('TrackTime not found');
    return trackTime;
  }
}
