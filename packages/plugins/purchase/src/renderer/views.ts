import type { WorkbenchViewContribution } from '@true-north/plugin-sdk';
import { PURCHASE_VIEW_LIST } from '../contract';

export const purchaseWorkbenchViews: WorkbenchViewContribution[] = [
  {
    id: PURCHASE_VIEW_LIST,
    pluginId: 'purchase',
    nameKey: 'menu.purchase',
    order: 10,
    load: () => import('./features/list'),
  },
];
