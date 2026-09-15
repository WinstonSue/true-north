import { contributionKey, pluginPath, pluginResourceUri } from '@true-north/plugin-contract';
import { expenseManifest } from '../manifest';

export const EXPENSE_PLUGIN_ID = expenseManifest.pluginId;
export const expensePaths = {
  root: pluginPath(EXPENSE_PLUGIN_ID),
} as const;

export const expenseIds = {
  views: {
    transaction: contributionKey(EXPENSE_PLUGIN_ID, 'transaction'),
    budget: contributionKey(EXPENSE_PLUGIN_ID, 'budget'),
    overview: contributionKey(EXPENSE_PLUGIN_ID, 'overview'),
  },
  capture: {
    transaction: contributionKey(EXPENSE_PLUGIN_ID, 'transaction'),
  },
} as const;

export const EXPENSE_VIEW_TRANSACTION = expenseIds.views.transaction;
export const EXPENSE_VIEW_BUDGET = expenseIds.views.budget;
export const EXPENSE_VIEW_OVERVIEW = expenseIds.views.overview;

export type ExpenseView = 'transaction' | 'budget' | 'overview';

export function expenseHref(view?: ExpenseView): string {
  if (!view) return `${expensePaths.root}?view=transaction`;
  return `${expensePaths.root}?view=${view}`;
}

export function expenseTransactionUri(id: string) {
  return pluginResourceUri(EXPENSE_PLUGIN_ID, 'transactions', id);
}
