import type { CommandResult } from '@true-north/plugin-contract';

export type EdgePolicyStatus =
  | 'armed'
  | 'awaiting_interaction'
  | 'dispatching'
  | 'succeeded'
  | 'conflict'
  | 'retryable_error'
  | 'blocked_plugin'
  | 'failed_terminal'
  | 'cancelled'
  | 'expired';

export function edgeStatusFor(result: CommandResult): EdgePolicyStatus {
  if (result.status === 'conflict' || result.status === 'rejected' || result.status === 'notFound') return 'conflict';
  if (result.status === 'unavailable') return result.reason === 'pluginMissing' ? 'blocked_plugin' : 'retryable_error';
  return 'failed_terminal';
}

export function nextEdgeAfterSuccess(commandCursor: number, queueLength: number): {
  commandCursor: number;
  status: Extract<EdgePolicyStatus, 'armed' | 'succeeded'>;
} {
  const nextCursor = commandCursor + 1;
  return nextCursor >= queueLength
    ? { commandCursor: nextCursor, status: 'succeeded' }
    : { commandCursor: nextCursor, status: 'armed' };
}

export function planStatusFor(edges: Array<{ status: string }>): 'completed' | 'partial' | null {
  if (!edges.length) return null;
  if (edges.every((edge) => edge.status === 'succeeded')) return 'completed';
  if (edges.some((edge) => edge.status === 'succeeded') && edges.some((edge) => edge.status === 'conflict' || edge.status === 'cancelled')) {
    return 'partial';
  }
  return null;
}
