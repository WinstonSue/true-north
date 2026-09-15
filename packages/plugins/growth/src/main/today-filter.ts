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
