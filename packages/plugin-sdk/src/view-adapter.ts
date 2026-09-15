import { pluginPath } from '@true-north/plugin-contract';
import type { PluginViewSnapshot } from './runtime.ts';

export function localViewId(pluginId: string, viewId: string): string {
  const prefix = `${pluginId}.`;
  return viewId.startsWith(prefix) ? viewId.slice(prefix.length) : viewId;
}

export function locationFromSearchParams(search: URLSearchParams): Record<string, string> {
  const location: Record<string, string> = {};
  search.forEach((value, key) => {
    if (value) location[key] = value;
  });
  return location;
}

export function searchParamsFromLocation(location: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(location)) {
    if (value) params.set(key, value);
  }
  return params;
}

export function hrefFromLocation(pluginId: string, location: Record<string, string>): string {
  const query = searchParamsFromLocation(location).toString();
  return query ? `${pluginPath(pluginId)}?${query}` : pluginPath(pluginId);
}

/** Flatten a workbench open request into a plugin-page href. `params.view` wins; otherwise local id of `viewId`. */
export function hrefFromSnapshot(pluginId: string, snapshot: PluginViewSnapshot): string {
  const location: Record<string, string> = {};
  const view = snapshot.params.view || (snapshot.viewId ? localViewId(pluginId, snapshot.viewId) : '');
  if (view) location.view = view;
  for (const [key, value] of Object.entries(snapshot.params || {})) {
    if (key === 'view' || !value) continue;
    location[key] = value;
  }
  return hrefFromLocation(pluginId, location);
}
