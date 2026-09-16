import { Column, Entity, PrimaryColumn, type EntityManager } from 'typeorm';
import type { CommandResult } from '@true-north/plugin-contract';
import { hashCommandInput, replayLedgerResult, shouldRecordLedger } from './command-idempotency.ts';

export { hashCommandInput, nextRevision, revisionOf } from './command-idempotency.ts';

@Entity('plugin_command_ledger')
export class PluginCommandLedger {
  @PrimaryColumn('varchar')
  idempotencyKey!: string;

  @Column('varchar')
  inputHash!: string;

  @Column('simple-json')
  result!: CommandResult;

  @Column('datetime')
  createdAt!: Date;
}

export async function runPluginCommand(
  manager: EntityManager,
  idempotencyKey: string,
  input: unknown,
  execute: () => Promise<CommandResult>,
): Promise<CommandResult> {
  const inputHash = hashCommandInput(input);
  const repo = manager.getRepository(PluginCommandLedger);
  const existing = await repo.findOneBy({ idempotencyKey });
  if (existing) {
    return replayLedgerResult(existing, inputHash);
  }
  const result = await execute();
  if (shouldRecordLedger(result)) {
    await repo.save(
      repo.create({
        idempotencyKey,
        inputHash,
        result,
        createdAt: new Date(),
      }),
    );
  }
  return result;
}
