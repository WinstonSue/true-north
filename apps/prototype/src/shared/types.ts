import type { LucideIcon } from 'lucide-react';
import type { RepeatPayload } from '@true-north/components-repeat/types';

export type GoalType = 'vision' | 'result';
export type GoalStatus = 'todo' | 'doing' | 'done' | 'abandoned';
export type TaskStatus = 'todo' | 'doing' | 'done' | 'abandoned';
export type TodoStatus = 'todo' | 'in_progress' | 'done' | 'abandoned';
export type HabitStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type TodoRepeat = RepeatPayload & { settledTimes: number };
export type DrawerKind = 'goal' | 'task' | 'todo' | 'habit';

export type Goal = { id: string; title: string; description: string; parentId?: string; type: GoalType; status: GoalStatus; importance: number; difficulty: number; start: string; end: string; history: string[] };
export type Task = { id: string; title: string; description: string; goalId?: string; parentId?: string; status: TaskStatus; importance: number; difficulty: number; plannedStart: string; plannedEnd: string; start: string; end: string; estimated: number; actual: number };
export type Todo = { id: string; title: string; description: string; taskId?: string; goalId?: string; habitId?: string; status: TodoStatus; importance: number; urgency: number; planned: string; plannedStartTime: string; plannedEndTime: string; repeat?: TodoRepeat; history: string[] };
export type Habit = { id: string; title: string; goalIds: string[]; status: HabitStatus; importance: number; difficulty: number; repeat: RepeatPayload; streak: number; longest: number; logs: Array<{ date: string; completed: boolean }> };
export type FocusSession = { id: string; taskId?: string; title: string; minutes: number; at: string };
export type DrawerState = { kind: DrawerKind; id?: string } | null;
export type AiSuggestion = { id: string; kind: DrawerKind; title: string; goalId: string; parentId?: string; planned: string; importance: number; difficulty: number; impact: string; reason: string; conflict?: string };
export type NavigationItem = { id: string; path: string; label: string; icon: LucideIcon };
export type SaveEntity = (kind: DrawerKind, draft: Goal | Task | Todo | Habit) => void;
