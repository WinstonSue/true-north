import { useContext } from 'react';
import type { PluginViewOpenRequest } from '../runtime.ts';
import { sharedReactContext } from './shared-context.ts';

export type WorkbenchToolRegistry = {
  find(key: string): {
    workspaceKey: string;
    title: (payload: never) => string;
    entryLabel: (payload: never) => string;
    autoOpen?: (input: { payload: never; message: unknown; force: boolean }) => boolean;
    parsePayload: (payload: Record<string, unknown>) => unknown;
  } | undefined;
  all: unknown[];
};

export type WorkbenchRuntimeValue = {
  open: boolean;
  width: number;
  setLeftReserve?: (width: number) => void;
  toggle: () => void;
  openToolTab: (input: unknown) => Promise<void> | void;
  openPluginView: (input: PluginViewOpenRequest) => Promise<void> | void;
  pendingFollowUp: { conversationId: string; text: string } | null;
  clearFollowUp: () => void;
  tools: WorkbenchToolRegistry;
  [key: string]: unknown;
};

export const WorkbenchRuntimeContext = sharedReactContext<WorkbenchRuntimeValue | null>(
  '__true_north_workbench_runtime_context__',
  null,
);

export function useWorkbench<T extends WorkbenchRuntimeValue = WorkbenchRuntimeValue>(): T {
  const context = useContext(WorkbenchRuntimeContext);
  if (!context) throw new Error('useWorkbench 需在 WorkbenchProvider 内使用');
  return context as T;
}

export function useWorkbenchOptional<T extends WorkbenchRuntimeValue = WorkbenchRuntimeValue>(): T | null {
  return useContext(WorkbenchRuntimeContext) as T | null;
}
