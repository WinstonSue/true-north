import dayjs from 'dayjs';
import type {
  GrowthNotifySettings,
  HabitNotifyRule,
  TaskNotifyRule,
  TodoNotifyRule,
} from '@true-north/vo';

export const PLAN_START_TOKEN = 'planStart';

export const DEFAULT_GROWTH_NOTIFY_SETTINGS: GrowthNotifySettings = {
  todo: { overdueTimes: ['08:00', '21:00'], todayTimes: [PLAN_START_TOKEN, '21:00'] },
  task: { overdueTimes: ['08:00', '21:00'], currentTimes: [PLAN_START_TOKEN] },
  habit: { times: ['21:00'] },
};

export type NotifySlot = { date: string; hm: string };

export function normalizeHm(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed === PLAN_START_TOKEN) return PLAN_START_TOKEN;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return undefined;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function clockHm(value: Date | string): string {
  return dayjs(value).format('HH:mm');
}

export function dateOf(value: Date | string): string {
  return dayjs(value).format('YYYY-MM-DD');
}

export function mergeRule<T>(defaults: T, override?: T | null): T {
  if (!override) return defaults;
  return { ...defaults, ...override };
}

export function resolveToken(token: string, planStart?: string | null, fallback = '08:00'): string | undefined {
  const normalized = normalizeHm(token);
  if (!normalized) return undefined;
  if (normalized === PLAN_START_TOKEN) return normalizeHm(planStart) || fallback;
  return normalized;
}

function uniqueHms(tokens: string[], planStart?: string | null, fallback?: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const token of tokens) {
    const hm = resolveToken(token, planStart, fallback);
    if (!hm || seen.has(hm)) continue;
    seen.add(hm);
    result.push(hm);
  }
  return result;
}

function slotsOnDate(date: string, hms: string[]): NotifySlot[] {
  return hms.map((hm) => ({ date, hm }));
}

export function passedSlots(slots: NotifySlot[], now: Date): NotifySlot[] {
  const nowDate = dateOf(now);
  const nowHm = clockHm(now);
  return slots.filter((slot) => slot.date < nowDate || (slot.date === nowDate && slot.hm <= nowHm));
}

export function todoSlots(input: {
  now: Date;
  todo: { status: string; planDate: Date | string; planStartTime?: string | null; relatedType?: string };
  rule: TodoNotifyRule;
}): NotifySlot[] {
  if (input.todo.status === 'done' || input.todo.status === 'abandoned') return [];
  if (input.todo.relatedType === 'habit') return [];
  const today = dateOf(input.now);
  const planDate = dateOf(input.todo.planDate);
  if (planDate > today) return [];
  if (planDate < today) return slotsOnDate(today, uniqueHms(input.rule.overdueTimes));
  return slotsOnDate(today, uniqueHms(input.rule.todayTimes, input.todo.planStartTime, '08:00'));
}

export function taskSlots(input: {
  now: Date;
  task: { status: string; startAt?: Date | string | null; endAt?: Date | string | null };
  rule: TaskNotifyRule;
}): NotifySlot[] {
  if (input.task.status !== 'todo' && input.task.status !== 'doing') return [];
  const now = input.now;
  const today = dateOf(now);
  const endAt = input.task.endAt ? dayjs(input.task.endAt) : undefined;
  if (endAt?.isValid() && endAt.toDate().getTime() < now.getTime()) {
    const overdueFrom = endAt.toDate();
    return slotsOnDate(today, uniqueHms(input.rule.overdueTimes)).filter((slot) => {
      const slotAt = dayjs(`${slot.date} ${slot.hm}`).toDate();
      return slotAt.getTime() >= overdueFrom.getTime() || slot.date > dateOf(overdueFrom);
    });
  }
  const startAt = input.task.startAt ? dayjs(input.task.startAt) : undefined;
  if (!startAt?.isValid()) return [];
  if (startAt.toDate().getTime() > now.getTime()) return [];
  if (endAt?.isValid() && endAt.toDate().getTime() < now.getTime()) return [];
  const startDate = dateOf(startAt.toDate());
  const startHm = uniqueHms(input.rule.currentTimes, clockHm(startAt.toDate()), clockHm(startAt.toDate()));
  return slotsOnDate(startDate, startHm);
}

export function habitSlots(input: {
  now: Date;
  habit: { status: string; cycleTodoId?: string };
  cycleTodo?: { status: string; planDate: Date | string };
  rule: HabitNotifyRule;
}): NotifySlot[] {
  if (input.habit.status !== 'active' || !input.habit.cycleTodoId || !input.cycleTodo) return [];
  if (input.cycleTodo.status === 'done' || input.cycleTodo.status === 'abandoned') return [];
  const today = dateOf(input.now);
  const planDate = dateOf(input.cycleTodo.planDate);
  if (planDate !== today) return [];
  return slotsOnDate(today, uniqueHms(input.rule.times));
}

export function settingsOf(value?: GrowthNotifySettings | null): GrowthNotifySettings {
  if (!value) return DEFAULT_GROWTH_NOTIFY_SETTINGS;
  return {
    todo: mergeRule(DEFAULT_GROWTH_NOTIFY_SETTINGS.todo, value.todo),
    task: mergeRule(DEFAULT_GROWTH_NOTIFY_SETTINGS.task, value.task),
    habit: mergeRule(DEFAULT_GROWTH_NOTIFY_SETTINGS.habit, value.habit),
  };
}
