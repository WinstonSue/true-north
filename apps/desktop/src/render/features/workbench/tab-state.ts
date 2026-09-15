export function pluginViewTabId(viewId: string): string {
  return `plugin-view:${viewId}`;
}

export function neighborId(order: string[], closedId: string): string | null {
  const index = order.indexOf(closedId);
  if (index < 0) return order[order.length - 1] ?? null;
  return order[index + 1] ?? order[index - 1] ?? null;
}

export function isWebTabId(id: string, toolIds: Set<string>, pluginViewIds: Set<string>): boolean {
  return !toolIds.has(id) && !pluginViewIds.has(id);
}

export function needsFallbackWebTab(toolCount: number, pluginViewCount: number, webCount: number): boolean {
  return toolCount === 0 && pluginViewCount === 0 && webCount === 0;
}

export function upsertPluginViewTab<T extends { id: string }>(tabs: T[], next: T): T[] {
  const existing = tabs.find((tab) => tab.id === next.id);
  if (existing) {
    return tabs.map((tab) => (tab.id === next.id ? { ...tab, ...next } : tab));
  }
  return [...tabs, next];
}

export function appendTabOrder(order: string[], id: string): string[] {
  return order.includes(id) ? order : [...order, id];
}

export type PluginViewTargetState = {
  target?: { type: string; id: string };
  targetGeneration?: number;
};

export function withPluginViewTarget<T>(
  existing: T | undefined,
  next: T,
  target?: { type: string; id: string },
): T & PluginViewTargetState {
  const previous = existing as PluginViewTargetState | undefined;
  if (!target) {
    return {
      ...next,
      target: previous?.target,
      targetGeneration: previous?.targetGeneration,
    };
  }
  return {
    ...next,
    target,
    targetGeneration: (previous?.targetGeneration ?? 0) + 1,
  };
}

export function clearPluginViewTargetState<T>(tab: T): T & PluginViewTargetState {
  return {
    ...tab,
    target: undefined,
    targetGeneration: ((tab as PluginViewTargetState).targetGeneration ?? 0) + 1,
  };
}
