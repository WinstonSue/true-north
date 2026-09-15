import type { WorkbenchViewContribution } from '@true-north/plugin-sdk';
import {
  EXPENSE_VIEW_BUDGET,
  EXPENSE_VIEW_OVERVIEW,
  EXPENSE_VIEW_TRANSACTION,
} from '../contract';

export const expenseWorkbenchViews: WorkbenchViewContribution[] = [
  {
    id: EXPENSE_VIEW_TRANSACTION,
    pluginId: 'expense',
    nameKey: 'menu.expense.transaction',
    order: 10,
    load: () => import('./features/transaction'),
  },
  {
    id: EXPENSE_VIEW_BUDGET,
    pluginId: 'expense',
    nameKey: 'menu.expense.budget',
    order: 20,
    load: () => import('./features/budget'),
  },
  {
    id: EXPENSE_VIEW_OVERVIEW,
    pluginId: 'expense',
    nameKey: 'menu.expense.overview',
    order: 30,
    load: () => import('./features/overview'),
  },
];
