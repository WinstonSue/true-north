import dayjs from 'dayjs';
import { Difficulty, GoalType, TodoRelatedType } from '@true-north/enum';
import type { AiWorkspaceSuggestionVo, GoalVo, TaskVo } from '@true-north/vo';
import type { GoalFormData, TaskFormData, TodoFormData } from '../../../client';

export const KIND_CREATE_TITLE: Record<string, string> = {
  goal: '新建子目标',
  task: '新建任务',
  todo: '新建待办',
  habit: '新增习惯',
};

function dateValue(value?: string | Date | null) {
  return value ? dayjs(value) : undefined;
}

export function suggestionToGoalForm(
  suggestion: AiWorkspaceSuggestionVo,
  parent: GoalVo,
): Partial<GoalFormData> {
  return {
    name: suggestion.title,
    description: suggestion.reason,
    parentId: parent.id,
    type: GoalType.RESULT,
    importance: suggestion.importance,
    difficulty: suggestion.difficulty as Difficulty,
    planTimeRange: [
      dateValue(parent.startAt) || dateValue(suggestion.planned),
      dateValue(parent.endAt) || dateValue(suggestion.planned),
    ],
  };
}

export function suggestionToTaskForm(
  suggestion: AiWorkspaceSuggestionVo,
  parent: { id: string; startAt?: string | Date | null; endAt?: string | Date | null },
  source: 'goal' | 'task',
): Partial<TaskFormData> {
  const start = dateValue(parent.startAt) || dateValue(suggestion.planned);
  const end = dateValue(parent.endAt) || dateValue(suggestion.planned);
  return {
    name: suggestion.title,
    description: suggestion.reason,
    importance: suggestion.importance,
    difficulty: suggestion.difficulty as Difficulty,
    estimateTime: 3600,
    isSubTask: source === 'task',
    parentId: source === 'task' ? parent.id : undefined,
    goalId: source === 'goal' ? parent.id : undefined,
    planTimeRange: [start, end],
  };
}

export function suggestionToTodoForm(
  suggestion: AiWorkspaceSuggestionVo,
  parentId: string,
  relatedType: TodoRelatedType.GOAL | TodoRelatedType.TASK,
): Partial<TodoFormData> {
  return {
    name: suggestion.title,
    description: suggestion.reason,
    planDate: suggestion.planned,
    importance: suggestion.importance,
    relatedType,
    relatedId: parentId,
    taskId: relatedType === TodoRelatedType.TASK ? parentId : undefined,
  };
}

export function suggestionToHabitValues(
  suggestion: AiWorkspaceSuggestionVo,
  goalId: string,
) {
  return {
    name: suggestion.title,
    description: suggestion.reason,
    importance: suggestion.importance,
    difficulty: (suggestion.difficulty as Difficulty) || Difficulty.Challenger,
    goalIds: [goalId],
    repeatStartDate: suggestion.planned || dayjs().format('YYYY-MM-DD'),
  };
}
