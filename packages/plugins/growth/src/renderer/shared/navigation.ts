import { contributionKey } from '@true-north/plugin-contract';
import { GROWTH_PLUGIN_ID } from '../../contract/ids.ts';
import {
  defaultTabForView as contractDefaultTabForView,
  definitionForView,
  growthViewDefinitions,
  type GrowthViewId,
} from '../../contract/view-definitions.ts';

export type GrowthNavChild = {
  tab?: string;
  nameKey: string;
};

export type GrowthNavGroup = {
  view: string;
  nameKey: string;
  children: GrowthNavChild[];
};

export const growthNavigation: GrowthNavGroup[] = (
  Object.keys(growthViewDefinitions) as GrowthViewId[]
).map((view) => {
  const definition = growthViewDefinitions[view];
  return {
    view: definition.view,
    nameKey: definition.nameKey,
    children: definition.menu.map((item) => ({
      tab: 'tab' in item ? item.tab : undefined,
      nameKey: item.nameKey,
    })),
  };
});

export function localViewFromViewId(viewId: string): string {
  const prefix = `${GROWTH_PLUGIN_ID}.`;
  return viewId.startsWith(prefix) ? viewId.slice(prefix.length) : viewId;
}

export function defaultTabForView(view: string): string {
  return contractDefaultTabForView(localViewFromViewId(view));
}

export function locationForNavChild(view: string, child: GrowthNavChild) {
  const location: Record<string, string> = { view };
  if (child.tab && child.tab !== defaultTabForView(view)) location.tab = child.tab;
  return location;
}

export function usesCompactNav(mode: 'page' | 'workbench') {
  return mode === 'workbench';
}

export function activeNavState(location: Record<string, string>) {
  const view = location.view || 'todo';
  const group = growthNavigation.find((item) => item.view === view) || growthNavigation[0];
  const tab = location.tab || defaultTabForView(group.view);
  const definition = definitionForView(group.view);
  const child =
    group.children.find((item) => (item.tab || definition.defaultTab) === tab) ||
    group.children.find((item) => item.tab === definition.defaultTab) ||
    group.children[0];
  return { group, child, tab };
}

export function viewIdForLocal(view: string): string {
  return contributionKey(GROWTH_PLUGIN_ID, view);
}

export function compactNavItems(view: string): { key: string; labelKey: string }[] {
  const local = localViewFromViewId(view);
  const group = growthNavigation.find((item) => item.view === local);
  const fallbackTab = defaultTabForView(local);
  return (group?.children || []).map((child) => ({
    key: child.tab || fallbackTab,
    labelKey: child.nameKey,
  }));
}
