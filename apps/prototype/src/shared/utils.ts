import { HOLIDAYS_2026 } from './mock-data';
import type { Goal, RecurrenceRule, RepeatMode } from './types';

function iso(date: Date) { return date.toISOString().slice(0, 10); }
export function dateOf(value: string) { return new Date(`${value}T12:00:00`); }
export function addDays(value: string, amount: number) { const date = dateOf(value); date.setDate(date.getDate() + amount); return iso(date); }
export function daysBetween(start: string, end: string) { return Math.round((dateOf(end).getTime() - dateOf(start).getTime()) / 86400000); }
export function statusLabel(status: string) { return ({ todo: '待开始', doing: '进行中', done: '已完成', paused: '已暂停', archived: '已归档', blocked: '受阻', abandoned: '已放弃', in_progress: '进行中', active: '进行中', completed: '已完成' } as Record<string, string>)[status] || status; }
export function goalName(goals: Goal[], id?: string) { return goals.find((goal) => goal.id === id)?.title || '独立事项'; }
function isWorkday(value: string) { const day = dateOf(value).getDay(); return day > 0 && day < 6 && !HOLIDAYS_2026.has(value); }
function matchesRule(value: string, rule: RecurrenceRule) {
  const day = dateOf(value).getDay();
  if (rule.mode === 'daily') return true;
  if (rule.mode === 'weekly') return rule.weekdays.includes(day === 0 ? 7 : day);
  if (rule.mode === 'monthly') return dateOf(value).getDate() === Math.min(rule.monthlyDay, new Date(dateOf(value).getFullYear(), dateOf(value).getMonth() + 1, 0).getDate());
  if (rule.mode === 'weekdays') return day > 0 && day < 6;
  if (rule.mode === 'weekend') return day === 0 || day === 6;
  return isWorkday(value);
}
export function nextOccurrence(value: string, rule: RecurrenceRule) {
  for (let offset = 1; offset < 400; offset += 1) { const next = addDays(value, offset); if (matchesRule(next, rule)) return next; }
  return undefined;
}
export function repeatLabel(rule: RecurrenceRule) {
  const base = ({ daily: '每天', weekly: `每周 ${rule.weekdays.map((day) => ['一', '二', '三', '四', '五', '六', '日'][day - 1]).join('、')}`, monthly: `每月 ${rule.monthlyDay} 日`, weekdays: '工作日', weekend: '周末', workdays: '法定工作日' } as Record<RepeatMode, string>)[rule.mode];
  return rule.endMode === 'forever' ? `${base}，永不结束` : rule.endMode === 'times' ? `${base}，共 ${rule.times || 1} 次` : `${base}，至 ${rule.endDate}`;
}
