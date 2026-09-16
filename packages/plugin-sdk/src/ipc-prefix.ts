import type { PluginIpcPort } from './runtime.ts';

export function prefixPluginIpc(ipc: PluginIpcPort, prefix: string): PluginIpcPort {
  const withPrefix = (path: string) => {
    if (path.startsWith(prefix) || path.startsWith('/ai') || path.startsWith('/workflow')) return path;
    return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
  };
  return {
    get: (path, payload) => ipc.get(withPrefix(path), payload),
    post: (path, payload) => ipc.post(withPrefix(path), payload),
    put: (path, payload) => ipc.put(withPrefix(path), payload),
    remove: (path, payload) => ipc.remove(withPrefix(path), payload),
  };
}
