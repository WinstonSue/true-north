import { TodoRepeatRepository } from './todo-repeat.repository';
import {
  CreateTodoRepeatDto,
  UpdateTodoRepeatDto,
  TodoRepeatPageFilterDto,
  TodoRepeatFilterDto,
  TodoRepeatDto,
  TodoFilterDto,
  TodoDto,
} from './dto';
import { TodoRepeat } from './todo-repeat.entity';
import {
  assertRepeat,
  calculateNextDate,
  isValidDate,
  RepeatValidationError,
} from '@true-north/components-repeat/helpers';
import { RepeatEndMode } from '@true-north/components-repeat/types';
import { TodoStatus, TodoRelatedType } from '@true-north/enum';
import dayjs from 'dayjs';

export class TodoRepeatService {
  todoRepeatRepository: TodoRepeatRepository;

  constructor(todoRepeatRepository: TodoRepeatRepository) {
    this.todoRepeatRepository = todoRepeatRepository;
  }

  // ====== 基础 CRUD ======

  async create(createTodoRepeatDto: CreateTodoRepeatDto): Promise<TodoRepeatDto> {
    this.assertValidRepeat(createTodoRepeatDto);
    // 在创建前，确保 currentDate 符合重复规则
    createTodoRepeatDto = this.fixCurrentDate(createTodoRepeatDto);

    const entity = await this.todoRepeatRepository.create(createTodoRepeatDto.exportCreateEntity());
    const todoRepeatDto = new TodoRepeatDto();
    todoRepeatDto.importEntity(entity);
    return todoRepeatDto;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.todoRepeatRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(updateTodoRepeatDto: UpdateTodoRepeatDto): Promise<TodoRepeatDto> {
    const currentEntity = await this.todoRepeatRepository.findWithRelations(updateTodoRepeatDto.id);
    updateTodoRepeatDto.importUpdateEntity(currentEntity);
    this.assertValidRepeat(updateTodoRepeatDto);
    const entity = await this.todoRepeatRepository.update(updateTodoRepeatDto.exportUpdateEntity());
    const todoRepeatDto = new TodoRepeatDto();
    todoRepeatDto.importEntity(entity);
    return todoRepeatDto;
  }

  async findWithRelations(id: string): Promise<TodoRepeatDto> {
    const entity = await this.todoRepeatRepository.findWithRelations(id);
    const todoRepeatDto = new TodoRepeatDto();
    todoRepeatDto.importEntity(entity);
    this.assertValidRepeat(todoRepeatDto);
    return todoRepeatDto;
  }

  async findByFilter(filter: TodoRepeatFilterDto): Promise<TodoRepeatDto[]> {
    const entities = await this.todoRepeatRepository.findByFilter(filter);
    return entities.map((entity) => {
      const todoRepeatDto = new TodoRepeatDto();
      todoRepeatDto.importEntity(entity);
      this.assertValidRepeat(todoRepeatDto);
      return todoRepeatDto;
    });
  }

  async page(filter: TodoRepeatPageFilterDto): Promise<{
    list: TodoRepeatDto[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> {
    const result = await this.todoRepeatRepository.page(filter);
    return {
      ...result,
      list: result.list.map((entity) => {
        const todoRepeatDto = new TodoRepeatDto();
        todoRepeatDto.importEntity(entity);
        this.assertValidRepeat(todoRepeatDto);
        return todoRepeatDto;
      }),
    };
  }

  // ====== 业务逻辑编排 ======

  async batchUpdate(includeIds: string[], updateTodoRepeatDto: UpdateTodoRepeatDto): Promise<TodoRepeatDto[]> {
    const filterDto = new TodoRepeatFilterDto();
    filterDto.includeIds = includeIds;
    const updatesRepeatRule = [
      updateTodoRepeatDto.repeatMode,
      updateTodoRepeatDto.repeatConfig,
      updateTodoRepeatDto.repeatEndMode,
      updateTodoRepeatDto.repeatEndDate,
      updateTodoRepeatDto.repeatTimes,
      updateTodoRepeatDto.repeatStartDate,
    ].some((value) => value !== undefined);
    if (updatesRepeatRule) {
      const currentItems = await this.todoRepeatRepository.findByFilter(filterDto);
      currentItems.forEach((current) => {
        this.assertValidRepeat({
          repeatMode: updateTodoRepeatDto.repeatMode ?? current.repeatMode,
          repeatConfig: updateTodoRepeatDto.repeatConfig ?? current.repeatConfig,
          repeatEndMode: updateTodoRepeatDto.repeatEndMode ?? current.repeatEndMode,
          repeatEndDate: updateTodoRepeatDto.repeatEndDate ?? current.repeatEndDate,
          repeatTimes: updateTodoRepeatDto.repeatTimes ?? current.repeatTimes,
          repeatStartDate: updateTodoRepeatDto.repeatStartDate ?? current.repeatStartDate,
        });
      });
    }
    const result = await this.todoRepeatRepository.updateByFilter(filterDto, updateTodoRepeatDto as any);
    return result as any;
  }

  async done(id: string): Promise<any> {
    const todoRepeatUpdateEntity = new TodoRepeat();
    todoRepeatUpdateEntity.id = id;
    todoRepeatUpdateEntity.status = TodoStatus.DONE;
    await this.todoRepeatRepository.update(todoRepeatUpdateEntity);
  }

  /** 将模板标记为最终结束状态（无下一实例时） */
  async finish(id: string, status: TodoStatus.DONE | TodoStatus.ABANDONED): Promise<void> {
    const updateTodoRepeatDto = new UpdateTodoRepeatDto();
    updateTodoRepeatDto.id = id;
    updateTodoRepeatDto.status = status;
    if (status === TodoStatus.ABANDONED) {
      updateTodoRepeatDto.abandonedAt = new Date();
    }
    await this.update(updateTodoRepeatDto);
  }

  async restore(id: string): Promise<any> {
    const todoRepeatUpdateEntity = new TodoRepeat();
    todoRepeatUpdateEntity.id = id;
    todoRepeatUpdateEntity.status = TodoStatus.TODO;
    todoRepeatUpdateEntity.abandonedAt = undefined;
    await this.todoRepeatRepository.update(todoRepeatUpdateEntity);
  }

  /**
   * 结算当前实例：返回结算前的模板快照；若有下一有效日期则推进 currentDate 并重置为 todo，否则不推进。
   * nextDate 为 null 表示重复计划已结束。
   */
  async settleCurrent(id: string): Promise<{ settled: TodoRepeatDto; nextDate: string | null }> {
    let todoRepeatDto = await this.findWithRelations(id);
    if (todoRepeatDto.status !== TodoStatus.TODO) {
      throw new Error('当前状态不允许结算周期待办');
    }
    const repeatConfig = {
      repeatMode: todoRepeatDto.repeatMode,
      repeatConfig: todoRepeatDto.repeatConfig,
      repeatEndMode: todoRepeatDto.repeatEndMode,
      repeatEndDate: todoRepeatDto.repeatEndDate,
      repeatTimes: todoRepeatDto.repeatTimes,
      repeatStartDate: todoRepeatDto.repeatStartDate,
    };
    todoRepeatDto = this.fixCurrentDate(todoRepeatDto);
    const settledSnapshot = todoRepeatDto;

    const calculatedNextDateResult = calculateNextDate(dayjs(todoRepeatDto.currentDate), repeatConfig);
    if (calculatedNextDateResult.ok === false) {
      throw new RepeatValidationError(calculatedNextDateResult.issues);
    }
    const nextDate = calculatedNextDateResult.value
      ? calculatedNextDateResult.value.format('YYYY-MM-DD')
      : null;

    if (nextDate) {
      const updateTodoRepeatDto = new UpdateTodoRepeatDto();
      updateTodoRepeatDto.id = todoRepeatDto.id;
      updateTodoRepeatDto.currentDate = nextDate;
      updateTodoRepeatDto.status = TodoStatus.TODO;
      await this.update(updateTodoRepeatDto);
    }

    return { settled: settledSnapshot, nextDate };
  }

  /** @deprecated 使用 settleCurrent */
  async updateToNext(id: string): Promise<TodoRepeatDto> {
    const { settled, nextDate } = await this.settleCurrent(id);
    if (!nextDate) {
      await this.finish(id, TodoStatus.DONE);
    }
    return settled;
  }

  /**
   * 基于 TodoListFilter 的日期范围，展开符合条件的重复待办为 TodoDto 列表
   * 不会落库，仅在内存中生成；若当日已有具体待办，则使用已存在的待办（并补充 repeat 信息）
   */
  async generateTodoByRepeat(todoFilter: TodoFilterDto): Promise<TodoDto[]> {
    if (todoFilter.status && todoFilter.status !== TodoStatus.TODO) {
      return [];
    }
    const rangeStart = todoFilter.planDateStart ? dayjs(todoFilter.planDateStart) : undefined;
    const rangeEnd = todoFilter.planDateEnd ? dayjs(todoFilter.planDateEnd) : undefined;

    const repeatFilter = new TodoRepeatFilterDto();
    repeatFilter.currentDateStart = todoFilter.planDateStart;
    repeatFilter.currentDateEnd = todoFilter.planDateEnd;

    const todoRepeatList = await this.todoRepeatRepository.findByFilter(repeatFilter);
    const results: TodoDto[] = [];

    for (const todoRepeat of todoRepeatList) {
      let todoRepeatDto = new TodoRepeatDto();
      todoRepeatDto.importEntity(todoRepeat);

      const templateStatus = todoRepeatDto.status ?? TodoStatus.TODO;
      if (templateStatus !== TodoStatus.TODO) {
        continue;
      }
      if (todoFilter.status && templateStatus !== todoFilter.status) {
        continue;
      }

      // 结束条件预处理
      const endMode = todoRepeatDto.repeatEndMode as RepeatEndMode | undefined;
      const endDate = todoRepeatDto.repeatEndDate ? dayjs(todoRepeatDto.repeatEndDate) : undefined;
      const maxTimes = todoRepeatDto.repeatTimes ?? undefined;

      todoRepeatDto = this.fixCurrentDate(todoRepeatDto);

      // 确定生成待办的日期
      let targetDate = todoRepeatDto.currentDate ? dayjs(todoRepeatDto.currentDate) : null;

      if (!targetDate) {
        continue; // 没有当前日期，跳过
      }

      // 检查目标日期是否在查询范围内
      if (rangeStart && targetDate.isBefore(rangeStart, 'day')) {
        continue;
      }
      if (rangeEnd && targetDate.isAfter(rangeEnd, 'day')) {
        continue;
      }

      // 次数限制检查（若设置 FOR_TIMES）
      if (endMode === RepeatEndMode.FOR_TIMES) {
        const repeatTodo = await this.findWithRelations(todoRepeatDto.id);
        if ((repeatTodo?.todos?.length ?? 0) >= (maxTimes || 0)) {
          continue;
        }
      }

      // 终止日期限制检查
      if (endMode === RepeatEndMode.TO_DATE && endDate && targetDate.isAfter(endDate, 'day')) {
        continue;
      }

      // 生成目标日期的待办
      const todoDto = this.generateTodo(todoRepeatDto, targetDate.toDate());
      results.push(todoDto);
    }

    return results;
  }

  generateTodo(todoRepeat: TodoRepeatDto, planDate?: Date): TodoDto {
    const todoDto = new TodoDto();
    todoDto.id = todoRepeat.id;
    todoDto.name = todoRepeat.name;
    todoDto.importEntity({
      id: todoRepeat.id,
      name: todoRepeat.name,
      description: todoRepeat.description,
      importance: todoRepeat.importance,
      urgency: todoRepeat.urgency,
      planDate: planDate || dayjs(todoRepeat.currentDate).toDate(),
      planStartTime: todoRepeat.planStartTime,
      planEndTime: todoRepeat.planEndTime,
      createdAt: new Date(),
      updatedAt: new Date(),
      repeat: todoRepeat,
      relatedType: TodoRelatedType.IS_REPEAT,
      status: todoRepeat.status ?? TodoStatus.TODO,
    });
    return todoDto;
  }

  fixCurrentDate<T extends TodoRepeatDto | CreateTodoRepeatDto>(todoRepeatDto: T): T {
    // 在创建前，确保 currentDate 符合重复规则
    if (todoRepeatDto.currentDate) {
      const repeatConfig = {
        repeatMode: todoRepeatDto.repeatMode,
        repeatConfig: todoRepeatDto.repeatConfig,
        repeatEndMode: todoRepeatDto.repeatEndMode,
        repeatEndDate: todoRepeatDto.repeatEndDate,
        repeatTimes: todoRepeatDto.repeatTimes,
        repeatStartDate: todoRepeatDto.repeatStartDate,
      };

      const currentDate = dayjs(todoRepeatDto.currentDate);
      const isCurrentDateValidResult = isValidDate(currentDate, repeatConfig);
      if (isCurrentDateValidResult.ok === false) {
        throw new RepeatValidationError(isCurrentDateValidResult.issues);
      }
      const isCurrentDateValid = isCurrentDateValidResult.value;

      if (!isCurrentDateValid) {
        // 如果当前日期不符合规则，找到下一个符合条件的日期
        const validNextDateResult = calculateNextDate(currentDate.subtract(1, 'day'), repeatConfig);
        if (validNextDateResult.ok === false) {
          throw new RepeatValidationError(validNextDateResult.issues);
        }
        const validNextDate = validNextDateResult.value;

        if (validNextDate) {
          todoRepeatDto.currentDate = validNextDate.format('YYYY-MM-DD');
        }
      }
    }

    return todoRepeatDto;
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
