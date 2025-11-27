import { Injectable } from '@nestjs/common';
import { TrackTime } from './entity';
import { TrackTimeDto, CreateTrackTimeDto, UpdateTrackTimeDto, TrackTimeFilterDto } from './dto';
import { TrackTimeRepository } from './track-time.repository';
import { TrackTimeRelatedType } from '@true-north/enum';

@Injectable()
export class TrackTimeService {
  constructor(private readonly trackTimeRepository: TrackTimeRepository) {}

  async create(createDto: CreateTrackTimeDto): Promise<TrackTimeDto> {
    const entity = new TrackTime();
    createDto.exportCreateEntity(entity);

    const saved = await this.trackTimeRepository.create(entity);

    return TrackTimeDto.importEntity(saved);
  }

  async find(id: string): Promise<TrackTimeDto | null> {
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

  async findByRelatedId(relatedType: TrackTimeRelatedType, relatedId: string): Promise<TrackTimeDto[]> {
    const trackTimeFilterDto = new TrackTimeFilterDto();
    trackTimeFilterDto.relatedType = relatedType;
    trackTimeFilterDto.relatedId = relatedId;
    const entities = await this.trackTimeRepository.findByFilter(trackTimeFilterDto);
    return entities.map((entity: TrackTime) => TrackTimeDto.importEntity(entity));
  }

  async deleteByRelatedId(relatedType: TrackTimeRelatedType, relatedId: string): Promise<void> {
    const trackTimeFilterDto = new TrackTimeFilterDto();
    trackTimeFilterDto.relatedType = relatedType;
    trackTimeFilterDto.relatedId = relatedId;
    await this.trackTimeRepository.deleteByFilter(trackTimeFilterDto);
  }
}
