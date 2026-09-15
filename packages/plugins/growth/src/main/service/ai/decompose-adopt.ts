import { Difficulty, GoalStatus, GoalType, TodoRelatedType, TodoStatus } from '@true-north/enum';
import { RepeatEndMode, RepeatMode } from '@true-north/components-repeat/types';
import type { AiWorkspaceSuggestionVo } from '@true-north/vo';
import { DomainRuleError, assertDraftAgainstBounds, inheritDecomposeFields } from '../../../shared/entity-bounds';
import { CreateGoalDto } from '../goal/dto';
import { GoalRepository } from '../goal/goal.repository';
import { goalService } from '../goal/goal.service';
import { CreateHabitDto } from '../habit/dto';
import { habitService } from '../habit/habit.service';
import { CreateTaskDto } from '../task/dto';
import { TaskRepository } from '../task/task.repository';
import { taskService } from '../task/task.service';
import { CreateTodoDto } from '../todo/dto';
import { todoService } from '../todo/todo.service';
import { goalContextBuilder } from './goal-context.builder';
import { taskContextBuilder } from './task-context.builder';

function requireTitle(suggestion: AiWorkspaceSuggestionVo): string {
  const title = suggestion.title?.trim();
  if (!title) throw new Error('请输入建议名称');
  return title;
}

export async function adoptGoalSuggestion(goalId: string, suggestion: AiWorkspaceSuggestionVo) {
  const context = await goalContextBuilder.build(goalId);
  const goal = await new GoalRepository().find(goalId);
  const inherited = inheritDecomposeFields(suggestion, context.bounds);
  try {
    assertDraftAgainstBounds({ ...suggestion, ...inherited }, context.bounds, 'goal');
  } catch (error) {
    if (error instanceof DomainRuleError) throw error;
    throw error;
  }

  const title = requireTitle(suggestion);
  const kind = suggestion.kind;
  if (kind === 'goal') {
    const dto = new CreateGoalDto();
    dto.name = title;
    dto.type = GoalType.RESULT;
    dto.parentId = goal.id;
    dto.status = GoalStatus.TODO;
    dto.importance = inherited.importance;
    dto.difficulty = inherited.difficulty as Difficulty;
    dto.startAt = goal.startAt;
    dto.endAt = goal.endAt;
    dto.description = '由目标 AI 拆解创建。';
    return goalService.create(dto);
  }
  if (kind === 'task') {
    const dto = new CreateTaskDto();
    dto.name = title;
    dto.description = '由目标 AI 拆解创建。';
    dto.tags = [];
    dto.importance = inherited.importance;
    dto.difficulty = inherited.difficulty as Difficulty;
    dto.urgency = 3;
    dto.goalId = goal.id;
    dto.startAt = goal.startAt;
    dto.endAt = goal.endAt;
    dto.estimateTime = 3600;
    return taskService.create(dto);
  }
  if (kind === 'todo') {
    const dto = new CreateTodoDto();
    dto.name = title;
    dto.description = '由目标 AI 拆解创建。';
    dto.status = TodoStatus.TODO;
    dto.planDate = new Date(`${inherited.planned}T00:00:00`);
    dto.importance = inherited.importance;
    dto.urgency = 3;
    dto.relatedType = TodoRelatedType.GOAL;
    dto.relatedId = goal.id;
    return todoService.create(dto, { system: true });
  }
  if (kind === 'habit') {
    const dto = new CreateHabitDto();
    dto.name = title;
    dto.description = '由目标 AI 拆解创建。';
    dto.importance = inherited.importance;
    dto.difficulty = inherited.difficulty as Difficulty;
    dto.tags = [];
    dto.goalIds = [goal.id];
    dto.repeatStartDate = inherited.planned;
    dto.repeatMode = RepeatMode.DAILY;
    dto.repeatEndMode = RepeatEndMode.FOREVER;
    return habitService.create(dto);
  }
  throw new Error('不支持的建议类型');
}

export async function adoptTaskSuggestion(taskId: string, suggestion: AiWorkspaceSuggestionVo) {
  const context = await taskContextBuilder.build(taskId);
  const task = await new TaskRepository().find(taskId);
  const inherited = inheritDecomposeFields(suggestion, context.bounds);
  try {
    assertDraftAgainstBounds({ ...suggestion, ...inherited }, context.bounds, 'task');
  } catch (error) {
    if (error instanceof DomainRuleError) throw error;
    throw error;
  }

  const title = requireTitle(suggestion);
  if (suggestion.kind === 'task') {
    const dto = new CreateTaskDto();
    dto.name = title;
    dto.description = '由任务 AI 拆解创建。';
    dto.tags = [];
    dto.importance = inherited.importance;
    dto.difficulty = inherited.difficulty as Difficulty;
    dto.urgency = task.urgency ?? 3;
    dto.parentId = task.id;
    dto.startAt = task.startAt;
    dto.endAt = task.endAt;
    dto.estimateTime = 3600;
    return taskService.create(dto);
  }
  if (suggestion.kind === 'todo') {
    const dto = new CreateTodoDto();
    dto.name = title;
    dto.description = '由任务 AI 拆解创建。';
    dto.status = TodoStatus.TODO;
    dto.planDate = new Date(`${inherited.planned}T00:00:00`);
    dto.importance = inherited.importance;
    dto.urgency = 3;
    dto.relatedType = TodoRelatedType.TASK;
    dto.relatedId = task.id;
    return todoService.create(dto, { system: true });
  }
  throw new Error('任务拆解仅支持子任务与待办');
}
