import { createContext, useContext, type ReactNode } from 'react';
import type { WorkbenchViewTarget } from '../runtime.ts';

export type WorkbenchViewRuntimeValue = {
  viewId: string;
  target: WorkbenchViewTarget | null;
  generation: number;
  clearTarget: () => void;
};

const WorkbenchViewRuntimeContext = createContext<WorkbenchViewRuntimeValue | null>(null);

export function WorkbenchViewRuntimeProvider({
  value,
  children,
}: {
  value: WorkbenchViewRuntimeValue;
  children: ReactNode;
}) {
  return <WorkbenchViewRuntimeContext.Provider value={value}>{children}</WorkbenchViewRuntimeContext.Provider>;
}

export function useWorkbenchViewRuntime(): WorkbenchViewRuntimeValue {
  const value = useContext(WorkbenchViewRuntimeContext);
  if (!value) throw new Error('useWorkbenchViewRuntime 需在 WorkbenchViewRuntimeProvider 内使用');
  return value;
}

export function useWorkbenchViewRuntimeOptional(): WorkbenchViewRuntimeValue | null {
  return useContext(WorkbenchViewRuntimeContext);
}
