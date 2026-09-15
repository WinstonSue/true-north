import { contributionKey } from '@true-north/plugin-contract';
import { GROWTH_PLUGIN_ID } from '../../contract/ids.ts';

export type GrowthNavChild = {
  tab?: string;
  nameKey: string;
};

export type GrowthNavGroup = {
  view: string;
  nameKey: string;
  children: GrowthNavChild[];
};

export const growthNavigation: GrowthNavGroup[] = [
  {
    view: 'todo',
    nameKey: 'menu.todo',
    children: [
      { tab: 'today', nameKey: 'menu.todo.today' },
      { tab: 'calendar', nameKey: 'menu.todo.calendar' },
      { tab: 'all', nameKey: 'menu.todo.all' },
    ],
  },
  {
    view: 'task',
    nameKey: 'menu.task',
    children: [
      { tab: 'today', nameKey: 'menu.task.today' },
      { tab: 'calendar', nameKey: 'menu.task.calendar' },
      { tab: 'all', nameKey: 'menu.task.all' },
    ],
  },
  {
    view: 'habit',
    nameKey: 'menu.habit',
    children: [{ tab: 'list', nameKey: 'menu.habit.list' }],
  },
  {
    view: 'goal',
    nameKey: 'menu.goal',
    children: [
      { tab: 'tree', nameKey: 'menu.goal.tree' },
      { tab: 'mindmap', nameKey: 'menu.goal.mindmap' },
    ],
  },
];

export function localViewFromViewId(viewId: string): string {
  const prefix = `${GROWTH_PLUGIN_ID}.`;
  return viewId.startsWith(prefix) ? viewId.slice(prefix.length) : viewId;
}

export function locationForNavChild(view: string, child: GrowthNavChild) {
  const location: Record<string, string> = { view };
  if (child.tab && child.tab !== defaultTabForView(view)) location.tab = child.tab;
  return location;
}

export function defaultTabForView(view: string): string {
  const local = localViewFromViewId(view);
  if (local === 'habit') return 'list';
  if (local === 'goal') return 'tree';
  return 'today';
}

export function usesCompactNav(mode: 'page' | 'workbench') {
  return mode === 'workbench';
}

export function activeNavState(location: Record<string, string>) {
  const view = location.view || 'todo';
  const group = growthNavigation.find((item) => item.view === view) || growthNavigation[0];
  const tab = location.tab || defaultTabForView(group.view);
  const child =
    group.children.find((item) => (item.tab || defaultTabForView(group.view)) === tab) ||
    group.children.find((item) => item.tab === defaultTabForView(group.view)) ||
    group.children[0];
  return { group, child, tab };
}

export function viewIdForLocal(view: string): string {
  return contributionKey(GROWTH_PLUGIN_ID, view);
}
