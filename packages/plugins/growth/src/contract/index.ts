import { pluginResourceUri } from '@true-north/plugin-contract';
import { GROWTH_PLUGIN_ID, growthIds } from './ids.ts';

export { GROWTH_PLUGIN_ID, growthIds } from './ids.ts';
export {
  growthViewDefinitions,
  defaultTabForView,
  definitionForView,
  routeTabsForView,
  type GrowthTab,
  type GrowthViewId,
} from './view-definitions.ts';

export const GoalDecomposeKey = growthIds.workspaces.goalDecompose;
export const TaskDecomposeKey = growthIds.workspaces.taskDecompose;

export function growthGoalUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'goals', id);
}

export function growthTaskUri(id: string) {
  return pluginResourceUri(GROWTH_PLUGIN_ID, 'tasks', id);
}
