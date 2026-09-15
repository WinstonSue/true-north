import { pluginPath } from '@true-north/plugin-contract';

export const EXPENSE_PLUGIN_ID = 'expense';

export const expensePaths = {
  root: pluginPath(EXPENSE_PLUGIN_ID),
} as const;

export const EXPENSE_VIEW_TRANSACTION = 'expense.transaction';
export const EXPENSE_VIEW_BUDGET = 'expense.budget';
export const EXPENSE_VIEW_OVERVIEW = 'expense.overview';

export const expenseViewIds = {
  transaction: EXPENSE_VIEW_TRANSACTION,
  budget: EXPENSE_VIEW_BUDGET,
  overview: EXPENSE_VIEW_OVERVIEW,
} as const;

export type ExpenseView = 'transaction' | 'budget' | 'overview';

export function expenseHref(view?: ExpenseView): string {
  if (!view) return expensePaths.root;
  return `${expensePaths.root}?view=${view}`;
}
