import type { WorkbenchViewContribution } from '@true-north/plugin-sdk';
import { LIBRARY_VIEW_SEARCH } from '../contract';

export const libraryWorkbenchViews: WorkbenchViewContribution[] = [
  {
    id: LIBRARY_VIEW_SEARCH,
    pluginId: 'library',
    nameKey: 'menu.library',
    order: 10,
    load: () => import('./features/search'),
  },
];
