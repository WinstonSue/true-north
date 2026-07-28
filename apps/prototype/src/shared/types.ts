import type { LucideIcon } from 'lucide-react';

export type View = 'workbench' | 'goal' | 'task' | 'todo' | 'habit' | 'focus' | 'mindmap';
export type GoalType = 'result' | 'process' | 'metric' | 'vision' | 'milestone';
export type GoalStatus = 'todo' | 'doing' | 'done' | 'paused' | 'archived';
export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'done' | 'abandoned';
export type TodoStatus = 'todo' | 'in_progress' | 'done' | 'abandoned';
export type HabitStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type Score = 'perfect' | 'good' | 'basic' | 'miss';
export type Reminder = 'none' | 'time' | 'location' | 'habit-sync';
export type RepeatMode = 'daily' | 'weekly' | 'monthly' | 'weekdays' | 'weekend' | 'workdays';
export type DrawerKind = 'goal' | 'task' | 'todo' | 'habit';

export type Goal = { id: string; title: string; description: string; parentId?: string; type: GoalType; status: GoalStatus; importance: number; difficulty: number; start: string; end: string; progress: number; history: string[] };
export type Task = { id: string; title: string; description: string; goalId?: string; parentId?: string; status: TaskStatus; importance: number; difficulty: number; start: string; end: string; planned: string; estimated: number; actual: number; blockedReason?: string };
export type Todo = { id: string; title: string; description: string; taskId?: string; goalId?: string; status: TodoStatus; importance: number; urgency: number; planned: string; due: string; reminder: Reminder; history: string[]; recurrenceId?: string; occurrence?: number };
export type Habit = { id: string; title: string; goalIds: string[]; status: HabitStatus; importance: number; difficulty: number; weights: Record<string, number>; reminder: Reminder; tags: string[]; streak: number; longest: number; logs: Array<{ date: string; score: Score; mood: string; note: string }> };
export type FocusSession = { id: string; taskId?: string; title: string; minutes: number; at: string };
export type RecurrenceRule = { mode: RepeatMode; weekdays: number[]; monthlyDay: number; endMode: 'forever' | 'times' | 'date'; times?: number; endDate?: string };
export type RecurringTodoTemplate = { id: string; active: boolean; rule: RecurrenceRule; base: Omit<Todo, 'id' | 'history' | 'recurrenceId' | 'occurrence' | 'status'>; createdAt: string };
export type DrawerState = { kind: DrawerKind; id?: string } | null;
export type AiSuggestion = { id: string; kind: DrawerKind; title: string; goalId: string; parentId?: string; planned: string; importance: number; difficulty: number; impact: string; reason: string; conflict?: string };
export type NavigationItem = { id: View; label: string; icon: LucideIcon };
export type SaveEntity = (kind: DrawerKind, draft: Goal | Task | Todo | Habit, repeat?: RecurrenceRule) => void;
