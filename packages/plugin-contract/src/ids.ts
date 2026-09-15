export const PLUGIN_API_VERSION = 0 as const;

export type PluginApiVersion = typeof PLUGIN_API_VERSION;

export const PLUGIN_HUB_PATH = '/plugins';

export function pluginPath(pluginId: string): string {
  return `${PLUGIN_HUB_PATH}/${pluginId}`;
}

export function contributionKey(pluginId: string, localId: string): string {
  return `${pluginId}.${localId}`;
}

export function namespacedId(pluginId: string, localId: string): string {
  return contributionKey(pluginId, localId);
}

export function ipcRoute(pluginId: string, localId: string): string {
  return `/${pluginId}/${localId}`;
}

export function mcpName(pluginId: string, localId: string): string {
  return contributionKey(pluginId, localId);
}

export function pluginResourceUri(pluginId: string, collection: string, id?: string): string {
  const base = `tn://${pluginId}/${collection}`;
  return id ? `${base}/${id}` : base;
}

export function parsePluginResourceUri(
  uri: string,
): { pluginId: string; collection: string; id?: string } | null {
  const match = uri.match(/^tn:\/\/([a-z][a-z0-9-]*)\/([^/]+)(?:\/(.+))?$/);
  if (!match) return null;
  return { pluginId: match[1], collection: match[2], id: match[3] };
}

export const SHELL_SLOT_IDS = [
  'app-providers',
  'aside-sessions',
  'aside-actions',
  'page-overlay',
  'sidebar-primary',
  'stage-aside',
] as const;

export type ShellSlotId = (typeof SHELL_SLOT_IDS)[number];
