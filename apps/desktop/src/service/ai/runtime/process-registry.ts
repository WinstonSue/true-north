import type { ChildProcess } from 'child_process';

export type CancelHandle = {
  cancel: () => void | Promise<void>;
};

const handles = new Map<string, CancelHandle>();

export async function interruptThenKill(
  child: ChildProcess,
  first: NodeJS.Signals = 'SIGINT',
  timeoutMs = 2_000
): Promise<void> {
  if (child.killed || child.exitCode !== null) return;
  try {
    child.kill(first);
  } catch {
    // ignore
  }
  await Promise.race([
    new Promise<void>((resolve) => {
      child.once('exit', () => resolve());
    }),
    new Promise<void>((resolve) => {
      setTimeout(resolve, timeoutMs);
    }),
  ]);
  if (!child.killed && child.exitCode === null) {
    try {
      child.kill('SIGTERM');
    } catch {
      // ignore
    }
  }
}

export function registerCancelHandle(streamId: string, handle: CancelHandle): void {
  const previous = handles.get(streamId);
  handles.set(streamId, handle);
  if (previous) void previous.cancel();
}

export function registerChildProcess(
  streamId: string,
  child: ChildProcess,
  options?: { interruptSignal?: NodeJS.Signals }
): void {
  const handle: CancelHandle = {
    cancel: () => interruptThenKill(child, options?.interruptSignal ?? 'SIGINT'),
  };
  registerCancelHandle(streamId, handle);
  const cleanup = () => {
    if (handles.get(streamId) === handle) handles.delete(streamId);
  };
  child.once('exit', cleanup);
  child.once('error', cleanup);
}

export async function killChildProcess(streamId: string): Promise<boolean> {
  const handle = handles.get(streamId);
  if (!handle) return false;
  handles.delete(streamId);
  await handle.cancel();
  return true;
}
