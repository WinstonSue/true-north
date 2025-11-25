import { Injectable } from '@nestjs/common';
import { TrackTime } from './entity';
import { TrackTimeDto, CreateTrackTimeDto, UpdateTrackTimeDto, TrackTimeFilterDto } from './dto';
import { TrackTimeRepository } from './track-time.repository';

@Injectable()
export class TrackTimeService {
  constructor(private readonly trackTimeRepository: TrackTimeRepository) {}

  async create(createDto: CreateTrackTimeDto): Promise<TrackTimeDto> {
    const entity = new TrackTime();
    createDto.exportCreateEntity(entity);

    const saved = await this.trackTimeRepository.create(entity);
    
    return TrackTimeDto.importEntity(saved);
  }

  async findByFilter(filter?: TrackTimeFilterDto): Promise<TrackTimeDto[]> {
    const entities = await this.trackTimeRepository.findByFilter(filter || {});
    return entities.map((entity: TrackTime) => TrackTimeDto.importEntity(entity));
  }

  async findOne(id: string): Promise<TrackTimeDto | null> {
    const entity = await this.trackTimeRepository.find(id);
    if (!entity) return null;

    return TrackTimeDto.importEntity(entity);
  }

  async update(updateDto: UpdateTrackTimeDto): Promise<TrackTimeDto> {
    const entity = updateDto.exportUpdateEntity();
    const saved = await this.trackTimeRepository.update(entity);
    
    return TrackTimeDto.importEntity(saved);
  }

  async delete(id: string): Promise<void> {
    await this.trackTimeRepository.delete(id);
  }

  async findByRelatedId(relatedType: string, relatedId: string): Promise<TrackTimeDto[]> {
    const entities = await this.trackTimeRepository.findByRelatedId(relatedType, relatedId);
    return entities.map((entity: TrackTime) => TrackTimeDto.importEntity(entity));
  }

  async deleteByRelatedId(relatedType: string, relatedId: string): Promise<void> {
    await this.trackTimeRepository.deleteByRelatedId(relatedType, relatedId);
  }

  async findByRelatedIds(relatedType: string, relatedIds: string[]): Promise<TrackTimeDto[]> {
    const entities = await this.trackTimeRepository.findByRelatedIds(relatedType, relatedIds);
    return entities.map((entity: TrackTime) => TrackTimeDto.importEntity(entity));
  }

  async deleteByRelatedIds(relatedType: string, relatedIds: string[]): Promise<void> {
    await this.trackTimeRepository.deleteByRelatedIds(relatedType, relatedIds);
  }
}
