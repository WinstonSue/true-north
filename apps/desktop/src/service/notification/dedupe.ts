export function namespacePluginDedupeKey(pluginId: string, dedupeKey?: string) {
  const key = dedupeKey?.trim();
  if (!key) return undefined;
  const prefix = `${pluginId}:`;
  return key.startsWith(prefix) ? key : `${prefix}${key}`;
}
