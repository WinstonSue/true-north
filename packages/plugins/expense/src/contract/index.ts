import { contributionKey } from '@true-north/plugin-contract';
import { expenseManifest } from '../manifest';

const EXPENSE_PLUGIN_ID = expenseManifest.pluginId;

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
