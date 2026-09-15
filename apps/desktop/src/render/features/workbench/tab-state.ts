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

export type PluginViewSnapshotState = {
  params: Record<string, string>;
  revision: number;
};

export function withPluginViewSnapshot<T extends { id: string; title: string }>(
  existing: (T & PluginViewSnapshotState) | undefined,
  next: T,
  params?: Record<string, string>,
): T & PluginViewSnapshotState {
  const previous = existing as PluginViewSnapshotState | undefined;
  if (!params) {
    return {
      ...next,
      params: previous?.params || {},
      revision: previous?.revision ?? 0,
    };
  }
  return {
    ...next,
    params,
    revision: (previous?.revision ?? 0) + 1,
  };
}
