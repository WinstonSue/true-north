/** 宿主与插件共同遵守的清单协议版本。当前为 `0`；schema 会默认填入，插件清单不必手写。 */
export const PLUGIN_API_VERSION = 0 as const;

export type PluginApiVersion = typeof PLUGIN_API_VERSION;

/** 插件 Hub 在宿主路由中的根路径。单个插件 Hub 为 `/plugins/{pluginId}`。 */
export const PLUGIN_HUB_PATH = '/plugins';

/** 插件 Hub 路径：`/plugins/{pluginId}`。 */
export function pluginPath(pluginId: string): string {
  return `${PLUGIN_HUB_PATH}/${pluginId}`;
}

/**
 * 贡献的全局 id：`{pluginId}.{localId}`。
 * 用于 view、workspace、action、skill、workflow command 等跨插件唯一键。
 */
export function contributionKey(pluginId: string, localId: string): string {
  return `${pluginId}.${localId}`;
}

/** @deprecated 使用 {@link contributionKey}。 */
export function namespacedId(pluginId: string, localId: string): string {
  return contributionKey(pluginId, localId);
}

/** IPC 路由前缀：`/{pluginId}/{localId}`。渲染进程相对路径会再被加上 `/{pluginId}`。 */
export function ipcRoute(pluginId: string, localId: string): string {
  return `/${pluginId}/${localId}`;
}

/** 对外 MCP 工具 / prompt 名：与 {@link contributionKey} 相同，如 `growth.searchGoals`。 */
export function mcpName(pluginId: string, localId: string): string {
  return contributionKey(pluginId, localId);
}

/**
 * 插件资源 URI。宿主只转发、不解析领域含义。
 * - 集合：`tn://{pluginId}/{collection}`
 * - 实体：`tn://{pluginId}/{collection}/{id}`
 */
export function pluginResourceUri(pluginId: string, collection: string, id?: string): string {
  const base = `tn://${pluginId}/${collection}`;
  return id ? `${base}/${id}` : base;
}

/** 解析 {@link pluginResourceUri}；非法字符串返回 `null`。 */
export function parsePluginResourceUri(
  uri: string,
): { pluginId: string; collection: string; id?: string } | null {
  const match = uri.match(/^tn:\/\/([a-z][a-z0-9-]*)\/([^/]+)(?:\/(.+))?$/);
  if (!match) return null;
  return { pluginId: match[1], collection: match[2], id: match[3] };
}

/**
 * 宿主壳层可挂载点。清单 `contributions.shell.slots.*.slot` 必须是其中之一。
 *
 * - `app-providers`：应用根部 Provider / 全局副作用（如计时上下文）
 * - `aside-sessions`：左侧会话区扩展
 * - `aside-actions`：左侧栏操作区（如专注入口）
 * - `page-overlay`：页面浮层（如抽屉）
 * - `sidebar-primary`：主侧栏扩展
 * - `stage-aside`：插件舞台侧栏
 */
export const SHELL_SLOT_IDS = [
  'app-providers',
  'aside-sessions',
  'aside-actions',
  'page-overlay',
  'sidebar-primary',
  'stage-aside',
] as const;

export type ShellSlotId = (typeof SHELL_SLOT_IDS)[number];
