import { PLUGIN_API_VERSION, contributionKey, ipcRoute, mcpName } from './ids.ts';
import type { PluginManifest } from './manifest.ts';

/**
 * 清单目录级问题。`reconcile` 表示声明的贡献 key 与 main/renderer 实现不一致。
 * 其余 duplicate-* 比较的是派生后的全局键（路由、MCP 名、贡献 id、资源 URI）。
 */
export type CatalogIssue = {
  code:
    | 'api-version'
    | 'missing-dependency'
    | 'cycle'
    | 'duplicate-plugin'
    | 'duplicate-controller'
    | 'duplicate-tool'
    | 'duplicate-workspace'
    | 'duplicate-action'
    | 'duplicate-view'
    | 'duplicate-capture'
    | 'duplicate-today'
    | 'duplicate-slot'
    | 'duplicate-skill'
    | 'duplicate-resource'
    | 'duplicate-prompt'
    | 'reconcile';
  message: string;
  pluginId?: string;
};

function topoSort(manifests: PluginManifest[]): { order: string[]; cycles: string[][] } {
  const byId = new Map(manifests.map((item) => [item.pluginId, item]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const order: string[] = [];
  const cycles: string[][] = [];

  function visit(id: string, stack: string[]) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      const start = stack.indexOf(id);
      cycles.push(stack.slice(start >= 0 ? start : 0).concat(id));
      return;
    }
    visiting.add(id);
    const deps = byId.get(id)?.dependencies || [];
    for (const dep of deps) {
      if (byId.has(dep)) visit(dep, [...stack, id]);
    }
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  for (const manifest of manifests) visit(manifest.pluginId, []);
  return { order, cycles };
}

/** 校验 apiVersion、依赖、环、以及跨插件派生键冲突。 */
export function validateManifests(manifests: PluginManifest[]): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const ids = new Set<string>();

  for (const manifest of manifests) {
    if (ids.has(manifest.pluginId)) {
      issues.push({
        code: 'duplicate-plugin',
        pluginId: manifest.pluginId,
        message: `Duplicate pluginId ${manifest.pluginId}`,
      });
    }
    ids.add(manifest.pluginId);
    if (manifest.apiVersion !== PLUGIN_API_VERSION) {
      issues.push({
        code: 'api-version',
        pluginId: manifest.pluginId,
        message: `Plugin ${manifest.pluginId} apiVersion ${manifest.apiVersion} does not match host ${PLUGIN_API_VERSION}`,
      });
    }
  }

  const enabledIds = new Set(manifests.map((item) => item.pluginId));
  for (const manifest of manifests) {
    for (const dep of manifest.dependencies || []) {
      if (!enabledIds.has(dep)) {
        issues.push({
          code: 'missing-dependency',
          pluginId: manifest.pluginId,
          message: `Plugin ${manifest.pluginId} depends on missing ${dep}`,
        });
      }
    }
  }

  const { cycles, order } = topoSort(manifests);
  for (const cycle of cycles) {
    issues.push({
      code: 'cycle',
      message: `Plugin dependency cycle: ${cycle.join(' -> ')}`,
      pluginId: cycle[0],
    });
  }

  const controllers = new Map<string, string>();
  const tools = new Map<string, string>();
  const workspaces = new Map<string, string>();
  const actions = new Map<string, string>();
  const views = new Map<string, string>();
  const captures = new Map<string, string>();
  const today = new Map<string, string>();
  const slots = new Map<string, string>();
  const skills = new Map<string, string>();
  const resources = new Map<string, string>();
  const prompts = new Map<string, string>();

  function claim(
    map: Map<string, string>,
    key: string | undefined,
    pluginId: string,
    code: CatalogIssue['code'],
    label: string,
  ) {
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
      if (existing === pluginId) return;
      issues.push({
        code,
        pluginId,
        message: `Duplicate ${label} "${key}" from ${existing} and ${pluginId}`,
      });
      return;
    }
    map.set(key, pluginId);
  }

  for (const manifest of manifests) {
    const contrib = manifest.contributions;
    for (const id of Object.keys(contrib.ipc || {})) {
      claim(controllers, ipcRoute(manifest.pluginId, id), manifest.pluginId, 'duplicate-controller', 'controller route');
    }
    for (const id of Object.keys(contrib.ai?.mcp?.tools || {})) {
      claim(tools, mcpName(manifest.pluginId, id), manifest.pluginId, 'duplicate-tool', 'tool');
    }
    for (const [id, resource] of Object.entries(contrib.ai?.mcp?.resources || {})) {
      claim(resources, resource.uriTemplate, manifest.pluginId, 'duplicate-resource', 'resource');
      void id;
    }
    for (const id of Object.keys(contrib.ai?.mcp?.prompts || {})) {
      claim(prompts, mcpName(manifest.pluginId, id), manifest.pluginId, 'duplicate-prompt', 'prompt');
    }
    for (const id of Object.keys(contrib.ai?.skills || {})) {
      claim(skills, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-skill', 'skill');
    }
    for (const id of Object.keys(contrib.workbench?.workspaces || {})) {
      claim(workspaces, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-workspace', 'workspace key');
    }
    for (const id of Object.keys(contrib.workbench?.actions || {})) {
      claim(actions, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-action', 'workbench action');
    }
    for (const id of Object.keys(contrib.views || {})) {
      claim(views, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-view', 'view');
    }
    for (const id of Object.keys(contrib.activity?.captureTypes || {})) {
      claim(captures, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-capture', 'capture type');
    }
    for (const id of Object.keys(contrib.activity?.today || {})) {
      claim(today, contributionKey(manifest.pluginId, id), manifest.pluginId, 'duplicate-today', 'today section');
    }
    for (const [id, slot] of Object.entries(contrib.shell?.slots || {})) {
      claim(slots, `${slot.slot}:${id}`, manifest.pluginId, 'duplicate-slot', 'shell slot');
    }
  }

  void order;
  return issues;
}

/** 按 `dependencies` 拓扑排序后的启动顺序。 */
export function activationOrder(manifests: PluginManifest[]): string[] {
  return topoSort(manifests).order;
}

/** 启动顺序的逆序，用于销毁。 */
export function disposeOrder(manifests: PluginManifest[]): string[] {
  return [...activationOrder(manifests)].reverse();
}
