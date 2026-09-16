import { PluginCommandLedger } from '@true-north/plugin-sdk/main';
import { ExpenseTransaction } from './service/transaction.entity';
import { ExpenseBudget } from './service/budget.entity';

export const expenseEntities = [ExpenseTransaction, ExpenseBudget, PluginCommandLedger];
