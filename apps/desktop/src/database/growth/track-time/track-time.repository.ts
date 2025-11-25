import { AppDataSource } from '../../database.config';
import { TrackTimeFilterDto, TrackTime } from '@true-north/business-server';
import { TrackTimeRepository as _TrackTimeRepository } from '@true-north/business-server';
import { BaseRepository } from '../../common/base';
import { In } from 'typeorm';

export class TrackTimeRepository
  extends BaseRepository<TrackTime, TrackTimeFilterDto>
  implements _TrackTimeRepository
{
  constructor() {
    function buildQuery(filter: TrackTimeFilterDto) {
      const qb = this.repo.createQueryBuilder('trackTime');

      if (filter.relatedType !== undefined) {
        qb.andWhere('trackTime.relatedType = :relatedType', { relatedType: filter.relatedType });
      }
      if (filter.relatedId !== undefined) {
        qb.andWhere('trackTime.relatedId = :relatedId', { relatedId: filter.relatedId });
      }
      if (filter.startAt) {
        qb.andWhere('trackTime.startAt >= :startAt', { startAt: filter.startAt });
      }
      if (filter.endAt) {
        qb.andWhere('trackTime.endAt <= :endAt', { endAt: filter.endAt });
      }

      return qb;
    }

    super(AppDataSource.getRepository(TrackTime), buildQuery);
  }

  async findByRelatedId(relatedType: string, relatedId: string): Promise<TrackTime[]> {
    return this.repo.find({
      where: { relatedType, relatedId },
      order: { createdAt: 'DESC' }
    });
  }

  async deleteByRelatedId(relatedType: string, relatedId: string): Promise<void> {
    await this.repo.delete({ relatedType, relatedId });
  }

  async findByRelatedIds(relatedType: string, relatedIds: string[]): Promise<TrackTime[]> {
    return this.repo.find({
      where: { relatedType, relatedId: In(relatedIds) },
      order: { createdAt: 'DESC' }
    });
  }

  async deleteByRelatedIds(relatedType: string, relatedIds: string[]): Promise<void> {
    await this.repo.delete({ relatedType, relatedId: In(relatedIds) });
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
