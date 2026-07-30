import { HOLIDAYS_2026 } from './mock-data';
import type { Goal, HabitFrequency, RepeatMode, Todo } from './types';

export type ExecutionScope = 'today' | 'week';
export type ExecutionGroupKey = 'overdue' | 'current' | 'done' | 'abandoned';
export type ExecutionItem = { status: string };
export type ExecutionGroup<T> = {
  key: ExecutionGroupKey;
  title: string;
  items: T[];
};

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}
export function dateOf(value: string) {
  return new Date(`${value}T12:00:00`);
}
export function addDays(value: string, amount: number) {
  const date = dateOf(value);
  date.setDate(date.getDate() + amount);
  return iso(date);
}
export function daysBetween(start: string, end: string) {
  return Math.round((dateOf(end).getTime() - dateOf(start).getTime()) / 86400000);
}
export function getExecutionRange(scope: ExecutionScope, today: string) {
  if (scope === 'today') return { start: today, end: today, label: '今日' };

  const start = addDays(today, -dateOf(today).getDay());
  return { start, end: addDays(start, 6), label: '本周' };
}
export function groupExecutionItems<T extends ExecutionItem>(
  items: T[],
  scope: ExecutionScope,
  today: string,
  getTimeRange: (item: T) => { start: string; end: string },
): ExecutionGroup<T>[] {
  const { start, end, label } = getExecutionRange(scope, today);
  const pending = (item: T) => item.status !== 'done' && item.status !== 'abandoned';
  const inRange = (item: T) => {
    const range = getTimeRange(item);
    return range.start <= end && range.end >= start;
  };
  const isOverdue = (item: T) => getTimeRange(item).end < start;

  return [
    { key: 'overdue', title: '已过期', items: items.filter((item) => pending(item) && isOverdue(item)) },
    { key: 'current', title: label, items: items.filter((item) => pending(item) && inRange(item)) },
    { key: 'done', title: '已完成', items: items.filter((item) => item.status === 'done' && inRange(item)) },
    { key: 'abandoned', title: '已放弃', items: items.filter((item) => item.status === 'abandoned' && inRange(item)) },
  ];
}
export function statusLabel(status: string) {
  return (
    (
      {
        todo: '待开始',
        doing: '进行中',
        done: '已完成',
        paused: '已暂停',
        archived: '已归档',
        abandoned: '已放弃',
        in_progress: '进行中',
        active: '进行中',
        completed: '已完成',
      } as Record<string, string>
    )[status] || status
  );
}
export function formatTodoPlan(todo: Pick<Todo, 'planned' | 'plannedStartTime' | 'plannedEndTime'>) {
  return `${todo.planned} ${todo.plannedStartTime}-${todo.plannedEndTime}`;
}
export function compareTodoPlan(left: Todo, right: Todo) {
  return `${left.planned} ${left.plannedStartTime}`.localeCompare(`${right.planned} ${right.plannedStartTime}`);
}
export function goalName(goals: Goal[], id?: string) {
  return goals.find((goal) => goal.id === id)?.title || '独立事项';
}
function isWorkday(value: string) {
  const day = dateOf(value).getDay();
  return day > 0 && day < 6 && !HOLIDAYS_2026.has(value);
}
export function matchesFrequency(value: string, frequency: HabitFrequency) {
  const day = dateOf(value).getDay();
  if (frequency.mode === 'daily') return true;
  if (frequency.mode === 'weekly') return frequency.weekdays.includes(day === 0 ? 7 : day);
  if (frequency.mode === 'monthly')
    return (
      dateOf(value).getDate() ===
      Math.min(frequency.monthlyDay, new Date(dateOf(value).getFullYear(), dateOf(value).getMonth() + 1, 0).getDate())
    );
  if (frequency.mode === 'weekdays') return day > 0 && day < 6;
  if (frequency.mode === 'weekend') return day === 0 || day === 6;
  return isWorkday(value);
}
export function nextHabitOccurrence(after: string, frequency: HabitFrequency) {
  for (let offset = 1; offset <= 370; offset += 1) {
    const candidate = addDays(after, offset);
    if (matchesFrequency(candidate, frequency)) return candidate;
  }
  return addDays(after, 1);
}
export function nextHabitOccurrenceOnOrAfter(from: string, frequency: HabitFrequency) {
  if (matchesFrequency(from, frequency)) return from;
  return nextHabitOccurrence(from, frequency);
}
export function frequencyLabel(frequency: HabitFrequency) {
  return (
    {
      daily: '每天',
      weekly: `每周 ${frequency.weekdays.map((day) => ['一', '二', '三', '四', '五', '六', '日'][day - 1]).join('、')}`,
      monthly: `每月 ${frequency.monthlyDay} 日`,
      weekdays: '工作日',
      weekend: '周末',
      workdays: '法定工作日',
    } as Record<RepeatMode, string>
  )[frequency.mode];
}
