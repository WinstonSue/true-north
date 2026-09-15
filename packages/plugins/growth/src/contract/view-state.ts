import type { ViewStateCodec } from '@true-north/plugin-sdk';
import type { GrowthTab } from './index';

export type TodoViewState = { tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'> };
export type TaskViewState = { tab: Extract<GrowthTab, 'today' | 'calendar' | 'all'>; id?: string };
export type HabitViewState = { tab: Extract<GrowthTab, 'list' | 'detail'>; id?: string };
export type GoalViewState = { tab: Extract<GrowthTab, 'tree' | 'mindmap'>; id?: string };

function tabOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export const todoViewCodec: ViewStateCodec<TodoViewState> = {
  decode: (params) => ({ tab: tabOf(params.tab, ['today', 'calendar', 'all'] as const, 'today') }),
  encode: (state) => (state.tab && state.tab !== 'today' ? { tab: state.tab } : {}),
};

export const taskViewCodec: ViewStateCodec<TaskViewState> = {
  decode: (params) => ({
    tab: tabOf(params.tab, ['today', 'calendar', 'all'] as const, 'today'),
    id: params.id || undefined,
  }),
  encode: (state) => {
    const params: Record<string, string> = {};
    if (state.tab && state.tab !== 'today') params.tab = state.tab;
    if (state.id) params.id = state.id;
    return params;
  },
};

export const habitViewCodec: ViewStateCodec<HabitViewState> = {
  decode: (params) => ({
    tab: params.id ? 'detail' : tabOf(params.tab, ['list', 'detail'] as const, 'list'),
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
    tab: tabOf(params.tab, ['tree', 'mindmap'] as const, 'tree'),
    id: params.id || undefined,
  }),
  encode: (state) => {
    const params: Record<string, string> = {};
    if (state.tab && state.tab !== 'tree') params.tab = state.tab;
    if (state.id) params.id = state.id;
    return params;
  },
};
