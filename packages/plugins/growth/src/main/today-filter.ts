import dayjs from 'dayjs';

export type TodayHabitSource = {
  id: string;
  name: string;
  status: string;
  cycleTodoId?: string;
};

export type TodayTodoSource = {
  id: string;
  status: string;
  planDate: Date | string;
  relatedType?: string;
};

export type DueTaskSource = {
  id: string;
  status: string;
  startAt?: Date | string | null;
  endAt?: Date | string | null;
};

export function todayDate(now = new Date()): string {
  return dayjs(now).format('YYYY-MM-DD');
}

export function isOpenDueTodo(todo: TodayTodoSource, today: string): boolean {
  if (todo.status === 'done' || todo.status === 'abandoned') return false;
  return dayjs(todo.planDate).format('YYYY-MM-DD') <= today;
}

export function isStandaloneTodayTodo(todo: TodayTodoSource, today: string): boolean {
  if (todo.relatedType === 'habit') return false;
  return isOpenDueTodo(todo, today);
}

export function isTodayHabit(
  habit: TodayHabitSource,
  cycleTodo: TodayTodoSource | undefined,
  today: string,
): boolean {
  if (habit.status !== 'active' || !habit.cycleTodoId) return false;
  if (!cycleTodo || cycleTodo.id !== habit.cycleTodoId) return false;
  return isOpenDueTodo(cycleTodo, today);
}

export function isDueTask(task: DueTaskSource, today: string): boolean {
  if (task.status !== 'todo' && task.status !== 'doing') return false;
  const start = task.startAt ? dayjs(task.startAt).format('YYYY-MM-DD') : undefined;
  const end = task.endAt ? dayjs(task.endAt).format('YYYY-MM-DD') : undefined;
  if (end && end < today) return true;
  if (start && end) return start <= today && today <= end;
  if (start) return start <= today;
  if (end) return today <= end;
  return false;
}
