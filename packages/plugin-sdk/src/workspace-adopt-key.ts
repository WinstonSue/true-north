export function workspaceAdoptKey(workspaceId: string, pluginId: string, localId: string): string {
  return `workspace:${workspaceId}:${pluginId}.${localId}`;
}
