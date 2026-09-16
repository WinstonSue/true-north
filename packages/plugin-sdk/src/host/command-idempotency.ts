import { createHash } from 'crypto';
import type { CommandResult } from '@true-north/plugin-contract';

export { nextRevision, revisionOf } from '../revision.ts';
export { workspaceAdoptKey } from '../workspace-adopt-key.ts';

export function hashCommandInput(input: unknown): string {
  return createHash('sha256').update(JSON.stringify(input ?? null)).digest('hex');
}

export function isFrozenCommandResult(result: CommandResult | Record<string, unknown> | null | undefined): result is CommandResult {
  return !!result && (result.status === 'applied' || result.status === 'noop');
}

export function replayLedgerResult(
  existing: { inputHash: string; result: CommandResult },
  inputHash: string,
): CommandResult {
  if (existing.inputHash !== inputHash) {
    return {
      status: 'rejected',
      code: 'idempotencyCollision',
      reason: 'same idempotency key with different input',
    };
  }
  if (existing.result.status === 'applied') {
    return {
      status: 'noop',
      reason: 'idempotentReplay',
      resource: existing.result.resource,
      output: existing.result.output,
    };
  }
  return existing.result;
}

export function shouldRecordLedger(result: CommandResult): boolean {
  return result.status === 'applied' || result.status === 'noop';
}

export type HostAttemptReplay =
  | { action: 'replay'; result: CommandResult }
  | { action: 'collision' }
  | { action: 'retry' };

export function decideHostAttemptReplay(
  existing: { inputHash: string; status: string; result?: CommandResult | Record<string, unknown> | null },
  inputHash: string,
): HostAttemptReplay {
  const result = existing.result as CommandResult | undefined;
  if (existing.status !== 'completed' || !isFrozenCommandResult(result)) {
    return { action: 'retry' };
  }
  if (existing.inputHash !== inputHash) return { action: 'collision' };
  return {
    action: 'replay',
    result: replayLedgerResult({ inputHash: existing.inputHash, result }, inputHash),
  };
}
