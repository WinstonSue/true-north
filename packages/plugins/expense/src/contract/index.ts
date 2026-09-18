import { contributionKey } from '@true-north/plugin-contract';
import { expenseManifest } from '../manifest';

const EXPENSE_PLUGIN_ID = expenseManifest.pluginId;

export const expenseIds = {
  resources: {
    transaction: contributionKey(EXPENSE_PLUGIN_ID, 'transaction'),
  },
  capture: {
    transaction: contributionKey(EXPENSE_PLUGIN_ID, 'transaction'),
  },
} as const;
