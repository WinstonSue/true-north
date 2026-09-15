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
      transaction: { nameKey: 'menu.expense.transaction', order: 10 },
      budget: { nameKey: 'menu.expense.budget', order: 20 },
      overview: { nameKey: 'menu.expense.overview', order: 30 },
    },
    page: {},
    activity: {
      captureTypes: { transaction: {} },
      today: { spent: { kind: 'metric', titleKey: 'plugins.hub.spent', order: 10 } },
    },
  },
});

export default expenseManifest;
