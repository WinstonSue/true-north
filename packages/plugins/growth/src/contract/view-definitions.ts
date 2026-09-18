export const growthViewDefinitions = {
  todo: {
    view: 'todo',
    nameKey: 'menu.todo',
    defaultTab: 'today',
    routeTabs: ['today', 'calendar', 'all'] as const,
    menu: [
      { tab: 'today', nameKey: 'menu.todo.today' },
      { tab: 'calendar', nameKey: 'menu.todo.calendar' },
      { tab: 'all', nameKey: 'menu.todo.all' },
    ],
  },
  task: {
    view: 'task',
    nameKey: 'menu.task',
    defaultTab: 'today',
    routeTabs: ['today', 'calendar', 'all'] as const,
    menu: [
      { tab: 'today', nameKey: 'menu.task.today' },
      { tab: 'calendar', nameKey: 'menu.task.calendar' },
      { tab: 'all', nameKey: 'menu.task.all' },
    ],
  },
  habit: {
    view: 'habit',
    nameKey: 'menu.habit',
    defaultTab: 'list',
    routeTabs: ['list', 'detail'] as const,
    menu: [{ tab: 'list', nameKey: 'menu.habit.list' }],
  },
  goal: {
    view: 'goal',
    nameKey: 'menu.goal',
    defaultTab: 'tree',
    routeTabs: ['tree', 'mindmap'] as const,
    menu: [
      { tab: 'tree', nameKey: 'menu.goal.tree' },
      { tab: 'mindmap', nameKey: 'menu.goal.mindmap' },
    ],
  },
  notify: {
    view: 'notify',
    nameKey: 'menu.notify',
    defaultTab: '',
    routeTabs: [] as const,
    menu: [{ nameKey: 'menu.notify.settings' }],
  },
} as const;

export type GrowthViewId = keyof typeof growthViewDefinitions;
export type GrowthViewDefinition = (typeof growthViewDefinitions)[GrowthViewId];
export type GrowthTab =
  | (typeof growthViewDefinitions.todo.routeTabs)[number]
  | (typeof growthViewDefinitions.task.routeTabs)[number]
  | (typeof growthViewDefinitions.habit.routeTabs)[number]
  | (typeof growthViewDefinitions.goal.routeTabs)[number];

export function isGrowthViewId(view: string): view is GrowthViewId {
  return view in growthViewDefinitions;
}

export function definitionForView(view: string): GrowthViewDefinition {
  return isGrowthViewId(view) ? growthViewDefinitions[view] : growthViewDefinitions.todo;
}

export function defaultTabForView(view: string): string {
  return definitionForView(view).defaultTab;
}

export function routeTabsForView(view: string): readonly string[] {
  return definitionForView(view).routeTabs;
}
