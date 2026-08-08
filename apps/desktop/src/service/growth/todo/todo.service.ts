import { TodoRepository } from './todo.repository';
import { TodoRepeatRepository } from './todo-repeat.repository';
import { CreateTodoDto, UpdateTodoDto, TodoPageFilterDto, TodoFilterDto, TodoDto, UpdateTodoRepeatDto } from './dto';
import { Todo } from './todo.entity';
import { TodoStatus, TodoRelatedType } from '@true-north/enum';
import { TodoRepeatService } from './todo-repeat.service';
import dayjs from 'dayjs';
import { HabitRepository } from '../habit/habit.repository';
import { Habit } from '../habit/habit.entity';
import { HabitStatus } from '@true-north/enum';
import { calculateNextDate } from '@true-north/components-repeat/helpers';
import { RepeatEndMode } from '@true-north/components-repeat/types';

export class TodoService {
  protected todoRepository: TodoRepository;
  protected todoRepeatRepository: TodoRepeatRepository;
  protected todoRepeatService: TodoRepeatService;
  protected habitRepository: HabitRepository;

  constructor(
    todoRepository: TodoRepository,
    todoRepeatRepository: TodoRepeatRepository,
    habitRepository = new HabitRepository()
  ) {
    this.todoRepository = todoRepository;
    this.todoRepeatRepository = todoRepeatRepository;
    this.todoRepeatService = new TodoRepeatService(todoRepeatRepository);
    this.habitRepository = habitRepository;
  }

  // ====== 基础 CRUD ======
  async create(createTodoDto: CreateTodoDto): Promise<TodoDto> {
    if (createTodoDto.taskId || createTodoDto.habitId) {
      throw new Error('手动创建的待办不能指定系统来源');
    }
    const entity = await this.todoRepository.create(createTodoDto.exportCreateEntity());
    const todoDto = new TodoDto();
    todoDto.importEntity(entity);
    return todoDto;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const current = await this.todoRepository.find(id);
      if (current.habitId) throw new Error('习惯周期待办不能单独删除，请通过习惯操作结束周期');
      await this.todoRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(updateTodoDto: UpdateTodoDto, allowStatusChange = false): Promise<TodoDto> {
    const current = await this.todoRepository.find(updateTodoDto.id);
    if (
      updateTodoDto.status !== undefined &&
      updateTodoDto.status !== current.status &&
      !allowStatusChange
    ) {
      throw new Error('待办状态只能通过开始、暂停、完成、放弃或恢复操作更新');
    }
    if (current.relatedType && current.relatedType !== TodoRelatedType.NONE) {
      if (updateTodoDto.taskId !== undefined || updateTodoDto.habitId !== undefined) {
        throw new Error('系统生成待办的来源不可修改');
      }
    }
    const entity = await this.todoRepository.update(updateTodoDto.exportUpdateEntity());
    const todoDto = new TodoDto();
    todoDto.importEntity(entity);
    return todoDto;
  }

  async find(id: string): Promise<TodoDto> {
    const entity = await this.todoRepository.find(id);
    const todoDto = new TodoDto();
    todoDto.importEntity(entity);
    return todoDto;
  }

  async findWithRelations(id: string, relations?: string[]): Promise<TodoDto> {
    const entity = await this.todoRepository.findWithRelations(id, relations || []);
    const todoDto = new TodoDto();
    todoDto.importEntity(entity);
    return todoDto;
  }

  async findByFilter(filter: TodoFilterDto): Promise<TodoDto[]> {
    const entities = await this.todoRepository.findByFilter(filter);
    return entities.map((entity) => {
      const todoDto = new TodoDto();
      todoDto.importEntity(entity);
      return todoDto;
    });
  }

  async page(filter: TodoPageFilterDto): Promise<{
    list: TodoDto[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> {
    const result = await this.todoRepository.page(filter);
    return {
      ...result,
      list: result.list.map((entity) => {
        const todoDto = new TodoDto();
        todoDto.importEntity(entity);
        return todoDto;
      }),
    };
  }

  // ====== 业务逻辑编排 ======

  async list(filter: TodoFilterDto): Promise<TodoDto[]> {
    const todoDtoList = await this.findByFilter(filter);

    const todoRepeatDtoList = await this.todoRepeatService.generateTodoByRepeat(filter);

    return [...todoDtoList, ...todoRepeatDtoList];
  }

  async deleteByTaskIds(taskIds: string[]): Promise<void> {
    if (!taskIds || taskIds.length === 0) return;
    const filter = new TodoFilterDto();
    filter.taskIds = taskIds;
    await this.todoRepository.softDeleteByFilter(filter);
  }

  async done(relatedType: TodoRelatedType, id: string, { doneAt }: { doneAt?: string } = {}) {
    if (relatedType === TodoRelatedType.IS_REPEAT) {
      return await this.settleIsRepeat(id, true, doneAt);
    }
    const current = await this.todoRepository.find(id);
    await this.assertHabitCycleIsActive(current);
    if (current.status !== TodoStatus.TODO) {
      throw new Error('当前状态不允许标记为完成');
    }
    const updateTodoDto = new UpdateTodoDto();
    updateTodoDto.id = id;
    updateTodoDto.status = TodoStatus.DONE;
    updateTodoDto.doneAt = doneAt ? dayjs(doneAt).toDate() : new Date();
    const result = await this.update(updateTodoDto, true);
    await this.advanceHabitCycle(current, true);
    return result;
  }

  async doneBatch(filter: TodoFilterDto): Promise<any> {
    const todoIds: string[] = [];
    const todoRepeatIds: string[] = [];

    if ((filter.todoWithRepeatList?.length || 0) > 50) {
      throw new Error('单次最多完成 50 条待办');
    }
    filter.todoWithRepeatList?.forEach((todoWithRepeat) => {
      if (todoWithRepeat.relatedType === TodoRelatedType.IS_REPEAT) {
        todoRepeatIds.push(todoWithRepeat.id);
      } else {
        todoIds.push(todoWithRepeat.id);
      }
    });

    let result: any = [];

    // 逐条结算以保证习惯周期待办可以推进到下一实例。
    if (todoIds.length > 0) {
      for (const id of todoIds) result.push(await this.done(TodoRelatedType.NONE, id));
    }

    if (todoRepeatIds.length > 0) {
      for (const id of todoRepeatIds) {
        result.push(await this.settleIsRepeat(id, true));
      }
    }

    return result;
  }

  async abandon(relatedType: TodoRelatedType, id: string): Promise<any> {
    if (relatedType === TodoRelatedType.IS_REPEAT) {
      return await this.settleIsRepeat(id, false);
    }
    const current = await this.todoRepository.find(id);
    await this.assertHabitCycleIsActive(current);
    if (current.status !== TodoStatus.TODO) {
      throw new Error('当前状态不允许放弃');
    }
    const updateTodoDto = new UpdateTodoDto();
    updateTodoDto.id = id;
    updateTodoDto.status = TodoStatus.ABANDONED;
    updateTodoDto.abandonedAt = new Date();
    const result = await this.update(updateTodoDto, true);
    await this.advanceHabitCycle(current, false);
    return result;
  }

  /** 结算周期待办当前实例：物化 DONE/ABANDONED，推进或结束模板 */
  private async settleIsRepeat(
    id: string,
    completed: boolean,
    doneAt?: string,
  ): Promise<TodoDto> {
    const { settled, nextDate } = await this.todoRepeatService.settleCurrent(id);

    const createTodoDto = new CreateTodoDto();
    createTodoDto.name = settled.name;
    createTodoDto.description = settled.description;
    createTodoDto.importance = settled.importance;
    createTodoDto.urgency = settled.urgency;
    createTodoDto.planDate = dayjs(settled.currentDate).toDate();
    createTodoDto.planStartTime = settled.planStartTime;
    createTodoDto.planEndTime = settled.planEndTime;
    createTodoDto.status = completed ? TodoStatus.DONE : TodoStatus.ABANDONED;
    createTodoDto.repeatId = id;
    createTodoDto.relatedType = TodoRelatedType.REPEAT;

    const newTodo = await this.todoRepository.create(createTodoDto.exportCreateEntity());

    const updateTodoDto = new UpdateTodoDto();
    updateTodoDto.id = newTodo.id;
    updateTodoDto.status = completed ? TodoStatus.DONE : TodoStatus.ABANDONED;
    if (completed) {
      updateTodoDto.doneAt = doneAt ? dayjs(doneAt).toDate() : new Date();
    } else {
      updateTodoDto.abandonedAt = new Date();
    }
    const result = await this.update(updateTodoDto, true);

    if (!nextDate) {
      await this.todoRepeatService.finish(
        id,
        completed ? TodoStatus.DONE : TodoStatus.ABANDONED,
      );
    }

    return result;
  }

  async restore(id: string): Promise<any> {
    const current = await this.todoRepository.find(id);
    if (current.habitId) throw new Error('已结算的习惯待办不能恢复，请等待下一周期');
    const updateTodoDto = new UpdateTodoDto();
    updateTodoDto.id = id;
    updateTodoDto.status = TodoStatus.TODO;
    updateTodoDto.doneAt = undefined;
    updateTodoDto.abandonedAt = undefined;
    return await this.update(updateTodoDto, true);
  }

  private async advanceHabitCycle(todo: Todo, wasCompleted: boolean): Promise<void> {
    if (!todo.habitId) return;
    const habit = await this.habitRepository.find(todo.habitId);
    if (habit.status !== HabitStatus.ACTIVE || (habit.cycleTodoId && habit.cycleTodoId !== todo.id)) return;

    const completedCount = Math.max(habit.cycleCount || 1, 1);
    if (wasCompleted) {
      habit.completedCount = (habit.completedCount || 0) + 1;
      habit.currentStreak = (habit.currentStreak || 0) + 1;
      habit.longestStreak = Math.max(habit.longestStreak || 0, habit.currentStreak);
    } else {
      habit.currentStreak = 0;
    }
    if (habit.repeatEndMode === RepeatEndMode.FOR_TIMES && completedCount >= (habit.repeatTimes || 0)) {
      await this.completeHabit(habit);
      return;
    }

    const nextDateResult = calculateNextDate(dayjs(todo.planDate), {
      repeatStartDate: habit.repeatStartDate,
      repeatMode: habit.repeatMode,
      repeatConfig: habit.repeatConfig,
      repeatEndMode: habit.repeatEndMode,
      repeatEndDate: habit.repeatEndDate,
      repeatTimes: habit.repeatTimes,
    });
    if (!nextDateResult.ok || !nextDateResult.value) {
      await this.completeHabit(habit);
      return;
    }
    if (habit.repeatEndMode === RepeatEndMode.TO_DATE && habit.repeatEndDate && nextDateResult.value.isAfter(habit.repeatEndDate, 'day')) {
      await this.completeHabit(habit);
      return;
    }

    const nextTodo = new Todo();
    nextTodo.name = habit.name;
    nextTodo.description = habit.description;
    nextTodo.importance = habit.importance;
    nextTodo.planDate = nextDateResult.value.toDate();
    nextTodo.status = TodoStatus.TODO;
    nextTodo.relatedType = TodoRelatedType.HABIT;
    nextTodo.relatedId = habit.id;
    nextTodo.habitId = habit.id;
    const saved = await this.todoRepository.create(nextTodo);
    habit.cycleTodoId = saved.id;
    habit.cycleCount = completedCount + 1;
    await this.habitRepository.update(habit);
  }

  private async assertHabitCycleIsActive(todo: Todo): Promise<void> {
    if (!todo.habitId) return;
    const habit = await this.habitRepository.find(todo.habitId);
    if (habit.status !== HabitStatus.ACTIVE || habit.cycleTodoId !== todo.id) {
      throw new Error('该习惯当前未处于可打卡状态');
    }
  }

  private async completeHabit(habit: Habit): Promise<void> {
    habit.status = HabitStatus.COMPLETED;
    habit.cycleTodoId = undefined;
    habit.doneAt = new Date();
    await this.habitRepository.update(habit);
  }
}

export const todoRepeatService = new TodoRepeatService(new TodoRepeatRepository());
export const todoService = new TodoService(new TodoRepository(), new TodoRepeatRepository());
