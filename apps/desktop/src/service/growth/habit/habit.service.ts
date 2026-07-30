import { HabitRepository } from './habit.repository';
import { TodoRepository } from '../todo/todo.repository';
import { CreateHabitDto, UpdateHabitDto, HabitFilterDto, HabitPageFilterDto, HabitDto } from './dto';
import { Habit } from './habit.entity';
import { HabitStatus, TodoStatus } from '@true-north/enum';
import { assertRepeat } from '@true-north/components-repeat/helpers';

export class HabitService {
  habitRepository: HabitRepository;
  todoRepository: TodoRepository;

  constructor(habitRepository: HabitRepository, todoRepository: TodoRepository) {
    this.habitRepository = habitRepository;
    this.todoRepository = todoRepository;
  }

  // ====== 基础 CRUD ======
  async create(createHabitDto: CreateHabitDto): Promise<HabitDto> {
    this.assertValidRepeat(createHabitDto);
    const entity = await this.habitRepository.create(createHabitDto.exportCreateEntity());
    const habitDto = new HabitDto();
    habitDto.importEntity(entity);
    return habitDto;
  }

  async delete(id: string): Promise<void> {
    await this.habitRepository.delete(id);
  }

  async update(updateHabitDto: UpdateHabitDto): Promise<HabitDto> {
    const current = await this.habitRepository.find(updateHabitDto.id);
    this.assertValidRepeat({
      repeatMode: updateHabitDto.repeatMode ?? current.repeatMode,
      repeatConfig: updateHabitDto.repeatConfig ?? current.repeatConfig,
      repeatEndMode: updateHabitDto.repeatEndMode ?? current.repeatEndMode,
      repeatEndDate: updateHabitDto.repeatEndDate ?? current.repeatEndDate,
      repeatTimes: updateHabitDto.repeatTimes ?? current.repeatTimes,
      repeatStartDate: updateHabitDto.repeatStartDate ?? current.repeatStartDate,
    });
    const entity = await this.habitRepository.update(updateHabitDto.exportUpdateEntity());
    const habitDto = new HabitDto();
    habitDto.importEntity(entity);
    return habitDto;
  }

  async find(id: string): Promise<HabitDto> {
    const entity = await this.habitRepository.find(id);
    const dto = HabitDto.importEntity(entity);
    this.assertValidRepeat(dto);
    return dto;
  }

  async findWithRelations(id: string): Promise<HabitDto> {
    const entity = await this.habitRepository.findWithRelations(id);
    const habitDto = new HabitDto();
    habitDto.importEntity(entity);
    this.assertValidRepeat(habitDto);
    return habitDto;
  }

  async findByFilter(filter: HabitFilterDto): Promise<HabitDto[]> {
    const entities = await this.habitRepository.findByFilter(filter);
    return entities.map((entity) => {
      const dto = HabitDto.importEntity(entity);
      this.assertValidRepeat(dto);
      return dto;
    });
  }

  async page(
    filter: HabitPageFilterDto
  ): Promise<{ list: HabitDto[]; total: number; pageNum: number; pageSize: number }> {
    const { list, total, pageNum, pageSize } = await this.habitRepository.page(filter);
    return {
      list: list.map((entity) => {
        const dto = HabitDto.importEntity(entity);
        this.assertValidRepeat(dto);
        return dto;
      }),
      total,
      pageNum,
      pageSize,
    };
  }

  //  ====== 业务逻辑编排 ======
  async abandon(id: string): Promise<void> {
    await this.update(Object.assign(new UpdateHabitDto(), { status: HabitStatus.ABANDONED }));
  }

  async restore(id: string): Promise<void> {
    await this.update(Object.assign(new UpdateHabitDto(), { status: HabitStatus.DOING }));
  }

  private assertValidRepeat(value: {
    repeatMode?: unknown;
    repeatConfig?: unknown;
    repeatEndMode?: unknown;
    repeatEndDate?: unknown;
    repeatTimes?: unknown;
    repeatStartDate?: unknown;
  }): void {
    assertRepeat({
      repeatMode: value.repeatMode,
      repeatConfig: value.repeatConfig,
      repeatEndMode: value.repeatEndMode,
      repeatEndDate: value.repeatEndDate,
      repeatTimes: value.repeatTimes,
      repeatStartDate: value.repeatStartDate,
    });
  }
}

export const habitService = new HabitService(new HabitRepository(), new TodoRepository());
