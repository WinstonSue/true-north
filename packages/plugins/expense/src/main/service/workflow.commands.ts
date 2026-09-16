import type { CommandResult, WorkflowCommandContext } from '@true-north/plugin-contract';
import type { WorkflowCommandHandler } from '@true-north/plugin-sdk';
import { runPluginCommand, revisionOf } from '@true-north/plugin-sdk/main';
import { store } from '../storage';
import { ExpenseTransaction } from './transaction.entity';
import { expenseService } from './expense.service';
import { transactionUri } from './workflow-cas';

export const createTransactionCommand: WorkflowCommandHandler = {
  async execute(input, ctx: WorkflowCommandContext): Promise<CommandResult> {
    return store().runInTransaction(async (tx) =>
      runPluginCommand(tx.manager, ctx.idempotencyKey, input, async () => {
        const body = (input || {}) as Record<string, unknown>;
        const created = await expenseService.createTransaction(
          {
            type: body.transactionType === 'income' ? 'income' : 'expense',
            amount: Number(body.amount || 0),
            description: String(body.title || body.description || ''),
            category: String(body.category || '其他'),
            tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
            transactionDateTime: body.occurredAt ? String(body.occurredAt) : new Date().toISOString(),
          },
          { manager: tx.manager },
        );
        const entity = await tx.manager.getRepository(ExpenseTransaction).findOneBy({ id: created.id });
        if (entity && (entity.revision == null || entity.revision < 1)) {
          entity.revision = 1;
          await tx.manager.getRepository(ExpenseTransaction).save(entity);
        }
        const uri = transactionUri(created.id);
        const revision = revisionOf(entity?.revision || 1);
        return {
          status: 'applied',
          resource: { uri, revision },
          output: { id: created.id },
          events: [{ localId: 'transactionBooked', payload: { title: created.description }, source: { uri, revision } }],
        };
      }),
    );
  },
};
