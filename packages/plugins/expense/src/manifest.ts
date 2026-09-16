import { definePluginManifest } from '@true-north/plugin-contract';
import { version } from '../package.json';

export const expenseManifest = definePluginManifest({
  pluginId: 'expense',
  version,
  catalog: {
    nameKey: 'menu.expense',
    descriptionKey: 'expense.hub.description',
    categoryKey: 'plugins.category.builtin',
    keywords: ['expense', 'budget', 'transaction', '记账', '预算', '账单'],
    order: 20,
  },
  contributions: {
    ipc: { expense: {} },
    views: {
      transaction: { nameKey: 'menu.expense.transaction' },
      budget: { nameKey: 'menu.expense.budget' },
      overview: { nameKey: 'menu.expense.overview' },
    },
    hub: {},
    workbench: {
      workspaces: { suggestTransaction: {} },
      newTabs: {
        transaction: { order: 10 },
        budget: { order: 20 },
        overview: { order: 30 },
      },
    },
    workflow: {
      events: {
        transactionBooked: { payloadSchema: { type: 'object' } },
        transactionDeleted: { payloadSchema: { type: 'object' } },
      },
      commands: {
        createTransaction: { inputSchema: { type: 'object' }, idempotent: true },
      },
    },
    ai: {
      mcp: {
        tools: {
          suggestTransaction: {},
        },
        resources: {
          transaction: { uriTemplate: 'tn://expense/transactions/{id}' },
        },
      },
    },
  },
});

export default expenseManifest;
