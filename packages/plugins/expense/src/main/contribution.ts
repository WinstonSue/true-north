import { defineMainImplementation, type PluginMainContext } from '@true-north/plugin-sdk';
import { expenseManifest } from '../manifest';
import { ExpenseController } from './service/expense.route-controller';
import { bindExpenseContext, startExpenseMonthWatch, stopExpenseMonthWatch } from './context';
import { activateStorage, disposeStorage } from './storage';
import { createTransactionCommand, deleteTransactionCommand } from './service/workflow.commands';
import { expenseTransactionResource, suggestTransactionTool } from './service/ai';

export function createExpenseMain() {
  return defineMainImplementation(expenseManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindExpenseContext(ctx);
      startExpenseMonthWatch();
      return {
        ipc: { expense: { controller: new ExpenseController() } },
        workflow: {
          commands: {
            createTransaction: createTransactionCommand,
            deleteTransaction: deleteTransactionCommand,
          },
        },
        ai: {
          mcp: {
            tools: { suggestTransaction: suggestTransactionTool },
          },
        },
        resources: { transaction: expenseTransactionResource },
      };
    },
    async dispose() {
      stopExpenseMonthWatch();
      await disposeStorage();
    },
  });
}
