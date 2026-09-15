import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { PluginViewSnapshot, ViewStateCodec } from '../runtime.ts';

export type PluginViewMode = 'page' | 'workbench';

export type PluginViewRuntimeValue = {
  snapshot: PluginViewSnapshot;
  revision: number;
  mode: PluginViewMode;
  setParams: (params: Record<string, string>) => void;
};

const PluginViewRuntimeContext = createContext<PluginViewRuntimeValue | null>(null);

export function PluginViewRuntimeProvider({
  value,
  children,
}: {
  value: PluginViewRuntimeValue;
  children: ReactNode;
}) {
  return <PluginViewRuntimeContext.Provider value={value}>{children}</PluginViewRuntimeContext.Provider>;
}

export function usePluginViewRuntime(): PluginViewRuntimeValue {
  const value = useContext(PluginViewRuntimeContext);
  if (!value) throw new Error('usePluginViewRuntime 需在 PluginViewRuntimeProvider 内使用');
  return value;
}

export function usePluginViewRuntimeOptional(): PluginViewRuntimeValue | null {
  return useContext(PluginViewRuntimeContext);
}

export function usePluginViewState<T>(codec: ViewStateCodec<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const runtime = usePluginViewRuntime();
  const state = useMemo(() => codec.decode(runtime.snapshot.params), [codec, runtime.snapshot.params]);
  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
      runtime.setParams(codec.encode(resolved));
    },
    [codec, runtime, state],
  );
  return [state, setState];
}

/** @deprecated use PluginViewRuntimeProvider */
export const WorkbenchViewRuntimeProvider = PluginViewRuntimeProvider;
/** @deprecated use usePluginViewRuntime */
export const useWorkbenchViewRuntime = usePluginViewRuntime;
/** @deprecated use usePluginViewRuntimeOptional */
export const useWorkbenchViewRuntimeOptional = usePluginViewRuntimeOptional;
export type WorkbenchViewRuntimeValue = PluginViewRuntimeValue;
