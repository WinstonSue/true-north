import { HabitRepository } from './habit.repository';
import { TodoRepository } from '../todo/todo.repository';
import { CreateHabitDto, UpdateHabitDto, HabitFilterDto, HabitPageFilterDto, HabitDto } from './dto';
import { Habit } from './habit.entity';
import { GoalStatus, HabitStatus, TodoRelatedType, TodoStatus } from '@true-north/enum';
import { assertRepeat } from '@true-north/components-repeat/helpers';
import { GoalRepository } from '../goal/goal.repository';
import { Todo } from '../todo/todo.entity';

export class HabitService {
  habitRepository: HabitRepository;
  todoRepository: TodoRepository;
  goalRepository: GoalRepository;

  constructor(
    habitRepository: HabitRepository,
    todoRepository: TodoRepository,
    goalRepository = new GoalRepository()
  ) {
    this.habitRepository = habitRepository;
    this.todoRepository = todoRepository;
    this.goalRepository = goalRepository;
  }

  // ====== 基础 CRUD ======
  async create(createHabitDto: CreateHabitDto): Promise<HabitDto> {
    this.assertValidRepeat(createHabitDto);
    const entity = createHabitDto.exportCreateEntity();
    entity.status = HabitStatus.ACTIVE;
    entity.goals = await this.resolveActiveGoals(createHabitDto.goalIds);
    const habit = await this.habitRepository.create(entity);
    await this.createCycleTodo(habit);
    return HabitDto.importEntity(await this.habitRepository.findWithRelations(habit.id));
  }

  async delete(id: string): Promise<void> {
    await this.habitRepository.delete(id);
  }

  async update(updateHabitDto: UpdateHabitDto): Promise<HabitDto> {
    const current = await this.habitRepository.find(updateHabitDto.id);
    if (updateHabitDto.status !== undefined) {
      throw new Error('习惯状态只能通过开始、暂停、放弃或周期结束操作更新');
    }
    this.assertValidRepeat({
      repeatMode: updateHabitDto.repeatMode ?? current.repeatMode,
      repeatConfig: updateHabitDto.repeatConfig ?? current.repeatConfig,
      repeatEndMode: updateHabitDto.repeatEndMode ?? current.repeatEndMode,
      repeatEndDate: updateHabitDto.repeatEndDate ?? current.repeatEndDate,
      repeatTimes: updateHabitDto.repeatTimes ?? current.repeatTimes,
      repeatStartDate: updateHabitDto.repeatStartDate ?? current.repeatStartDate,
    });
    const entity = updateHabitDto.exportUpdateEntity();
    if (updateHabitDto.goalIds !== undefined) {
      entity.goals = await this.resolveActiveGoals(updateHabitDto.goalIds);
    }
    const updated = await this.habitRepository.update(entity);
    return HabitDto.importEntity(updated);
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
  async pause(id: string): Promise<void> {
    await this.transition(id, HabitStatus.ACTIVE, HabitStatus.PAUSED);
  }

  async activate(id: string): Promise<void> {
    const habit = await this.habitRepository.find(id);
    if (habit.status !== HabitStatus.PAUSED && habit.status !== HabitStatus.ABANDONED) {
      throw new Error('当前状态不允许开始习惯');
    }
    habit.status = HabitStatus.ACTIVE;
    await this.habitRepository.update(habit);
    await this.createCycleTodo(habit);
  }

  async abandon(id: string): Promise<void> {
    const habit = await this.habitRepository.find(id);
    if (habit.status === HabitStatus.COMPLETED || habit.status === HabitStatus.ABANDONED) {
      throw new Error('当前状态不允许放弃习惯');
    }
    habit.status = HabitStatus.ABANDONED;
    habit.abandonedAt = new Date();
    if (habit.cycleTodoId) {
      const cycleTodo = await this.todoRepository.find(habit.cycleTodoId);
      if (cycleTodo.status === TodoStatus.TODO || cycleTodo.status === TodoStatus.IN_PROGRESS) {
        cycleTodo.status = TodoStatus.ABANDONED;
        cycleTodo.abandonedAt = habit.abandonedAt;
        await this.todoRepository.update(cycleTodo);
      }
      habit.cycleTodoId = undefined;
    }
    await this.habitRepository.update(habit);
  }

  private async transition(id: string, from: HabitStatus, to: HabitStatus): Promise<void> {
    const habit = await this.habitRepository.find(id);
    if (habit.status !== from) throw new Error('当前状态不允许该操作');
    habit.status = to;
    await this.habitRepository.update(habit);
  }

  private async resolveActiveGoals(goalIds?: string[]) {
    if (!goalIds?.length) throw new Error('习惯至少需要关联一个活跃目标');
    const goals = await Promise.all(goalIds.map((id) => this.goalRepository.find(id)));
    const inactive = goals.find((goal) => goal.status !== GoalStatus.TODO && goal.status !== GoalStatus.DOING);
    if (inactive) throw new Error(`目标“${inactive.name}”不是活跃目标`);
    return goals;
  }

  private async createCycleTodo(habit: Habit): Promise<void> {
    if (habit.status !== HabitStatus.ACTIVE || habit.cycleTodoId) return;
    const todo = new Todo();
    todo.name = habit.name;
    todo.description = habit.description;
    todo.importance = habit.importance;
    todo.tags = habit.tags || [];
    todo.planDate = new Date(habit.repeatStartDate);
    todo.status = TodoStatus.TODO;
    todo.relatedType = TodoRelatedType.HABIT;
    todo.relatedId = habit.id;
    todo.habitId = habit.id;
    const saved = await this.todoRepository.create(todo);
    habit.cycleTodoId = saved.id;
    habit.cycleCount = Math.max(1, habit.cycleCount || 0);
    await this.habitRepository.update(habit);
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
