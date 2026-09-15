import { defineMainImplementation, pluginResourceUri, type PluginMainContext } from '@true-north/plugin-sdk';
import dayjs from 'dayjs';
import { expenseManifest } from '../manifest';
import { ExpenseController } from './service/expense.route-controller';
import { expenseCaptureAdopter } from './service/capture.adopter';
import { expenseService } from './service/expense.service';
import { bindExpenseContext } from './context';
import { activateStorage, disposeStorage } from './storage';

export function createExpenseMain() {
  return defineMainImplementation(expenseManifest, {
    async activate(ctx: PluginMainContext) {
      await activateStorage(ctx.space);
      bindExpenseContext(ctx.activity);
      return {
        ipc: { expense: { controller: new ExpenseController() } },
        activity: {
          capture: { transaction: { adopt: (suggestion) => expenseCaptureAdopter.adopt(suggestion) } },
          today: {
            spent: {
              async collect() {
                const todayDate = dayjs().format('YYYY-MM-DD');
                const transactions = await expenseService.listTransactions();
                const spent = transactions
                  .filter(
                    (item) => item.type === 'expense' && dayjs(item.transactionDateTime).format('YYYY-MM-DD') === todayDate,
                  )
                  .reduce((sum, item) => sum + item.amount, 0);
                return { value: spent };
              },
            },
          },
        },
      };
    },
    async dispose() {
      await disposeStorage();
    },
  });
}
