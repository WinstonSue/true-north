import type { ViewStateCodec } from '@true-north/plugin-sdk';
import { growthViewDefinitions } from './view-definitions.ts';

export type TodoViewState = { tab: (typeof growthViewDefinitions.todo.routeTabs)[number] };
export type TaskViewState = { tab: (typeof growthViewDefinitions.task.routeTabs)[number]; id?: string };
export type HabitViewState = { tab: (typeof growthViewDefinitions.habit.routeTabs)[number]; id?: string };
export type GoalViewState = { tab: (typeof growthViewDefinitions.goal.routeTabs)[number]; id?: string };

function tabOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const todoDef = growthViewDefinitions.todo;
const taskDef = growthViewDefinitions.task;
const habitDef = growthViewDefinitions.habit;
const goalDef = growthViewDefinitions.goal;

export const todoViewCodec: ViewStateCodec<TodoViewState> = {
  decode: (params) => ({ tab: tabOf(params.tab, todoDef.routeTabs, todoDef.defaultTab) }),
  encode: (state) => (state.tab && state.tab !== todoDef.defaultTab ? { tab: state.tab } : {}),
};

export const taskViewCodec: ViewStateCodec<TaskViewState> = {
  decode: (params) => ({
    tab: tabOf(params.tab, taskDef.routeTabs, taskDef.defaultTab),
    id: params.id || undefined,
  }),
  encode: (state) => {
    const params: Record<string, string> = {};
    if (state.tab && state.tab !== taskDef.defaultTab) params.tab = state.tab;
    if (state.id) params.id = state.id;
    return params;
  },
};

export const habitViewCodec: ViewStateCodec<HabitViewState> = {
  decode: (params) => ({
    tab: params.id ? 'detail' : tabOf(params.tab, habitDef.routeTabs, habitDef.defaultTab),
    id: params.id || undefined,
  }),
  encode: (state) => {
    const params: Record<string, string> = {};
    if (state.tab === 'detail' || state.id) params.tab = 'detail';
    if (state.id) params.id = state.id;
    return params;
  },
};

export const goalViewCodec: ViewStateCodec<GoalViewState> = {
  decode: (params) => ({
    tab: tabOf(params.tab, goalDef.routeTabs, goalDef.defaultTab),
    id: params.id || undefined,
  }),
  encode: (state) => {
    const params: Record<string, string> = {};
    if (state.tab && state.tab !== goalDef.defaultTab) params.tab = state.tab;
    if (state.id) params.id = state.id;
    return params;
  },
};
