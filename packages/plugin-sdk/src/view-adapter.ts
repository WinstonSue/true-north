import { pluginPath } from '@true-north/plugin-contract';
import type { PluginViewSnapshot, WorkbenchViewContribution } from './runtime.ts';

export function localViewId(pluginId: string, viewId: string): string {
  const prefix = `${pluginId}.`;
  return viewId.startsWith(prefix) ? viewId.slice(prefix.length) : viewId;
}

export function snapshotFromSearchParams(
  pluginId: string,
  views: Array<Pick<WorkbenchViewContribution, 'id' | 'default' | 'order'>>,
  search: URLSearchParams,
): PluginViewSnapshot {
  const sorted = [...views].sort((a, b) => (a.order || 0) - (b.order || 0));
  const requested = search.get('view');
  const match =
    sorted.find((view) => localViewId(pluginId, view.id) === requested) ||
    sorted.find((view) => view.default) ||
    sorted[0];
  const params: Record<string, string> = {};
  search.forEach((value, key) => {
    if (key !== 'view' && value) params[key] = value;
  });
  return {
    viewId: match?.id || contributionFallback(pluginId, requested),
    params,
  };
}

function contributionFallback(pluginId: string, requested: string | null): string {
  return requested ? `${pluginId}.${requested}` : pluginId;
}

export function searchParamsFromSnapshot(pluginId: string, snapshot: PluginViewSnapshot): URLSearchParams {
  const params = new URLSearchParams();
  params.set('view', localViewId(pluginId, snapshot.viewId));
  for (const [key, value] of Object.entries(snapshot.params || {})) {
    if (value) params.set(key, value);
  }
  return params;
}

export function hrefFromSnapshot(pluginId: string, snapshot: PluginViewSnapshot): string {
  return `${pluginPath(pluginId)}?${searchParamsFromSnapshot(pluginId, snapshot).toString()}`;
}
