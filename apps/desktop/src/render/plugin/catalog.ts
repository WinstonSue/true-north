import { Sparkles, Blocks } from 'lucide-react';
import type { NavigateFunction } from 'react-router-dom';
import {
  assemblePluginCatalog,
  ExtensionRegistry,
  createHostActionPort,
  extensionPoints,
  hrefFromSnapshot,
  materializeRenderer,
  prefixPluginIpc,
  type PluginIpcPort,
  type PluginRendererContext,
  type PluginRendererHandles,
  type PluginViewOpenRequest,
} from '@true-north/plugin-sdk';
import { RendererPlatform } from '@true-north/plugin-sdk/renderer';
import type { IRoute } from '@/router/routes';
import lazyload from '@/utils/lazyload';
import { createAiWorkspaceHost } from '@/features/ai/workspace-host';
import { activityWorkbenchTools } from './activity/tools';
import { pluginPaths } from './paths';
import { firstPartyRendererDescriptors } from './renderer-loaders';

function unwrap<T>(res: { data: T; code: number; message: string }): T {
  if (res.code !== 200) throw new Error(res.message || 'IPC failed');
  return res.data;
}

export function createRendererIpcPort(): PluginIpcPort {
  const api = window.electronAPI;
  return {
    async get(path, payload) {
      return unwrap(await api.get(path, payload));
    },
    async post(path, payload) {
      return unwrap(await api.post(path, payload));
    },
    async put(path, payload) {
      return unwrap(await api.put(path, payload));
    },
    async remove(path, payload) {
      return unwrap(await api.remove(path, payload));
    },
  };
}

function dummyNavigate(to?: unknown) {
  if (typeof to === 'string') {
    window.location.hash = to.startsWith('#') ? to : `#${to}`;
  }
}

export async function bootRendererPlugins(lang = 'zh-CN'): Promise<RendererPlatform> {
  const catalog = await assemblePluginCatalog(firstPartyRendererDescriptors(), { side: 'renderer' });
  if (catalog.issues.length) {
    throw new Error(catalog.issues.map((issue) => `${issue.pluginId || 'catalog'}: ${issue.message}`).join('\n'));
  }

  const registry = new ExtensionRegistry();
  const ipc = createRendererIpcPort();
  const hostActions = createHostActionPort(registry, 'host');
  const registered: string[] = [];

  try {
    for (const plugin of catalog.plugins) {
      const pluginIpc = prefixPluginIpc(ipc, `/${plugin.manifest.pluginId}`);
      const ctx: PluginRendererContext = {
        pluginId: plugin.manifest.pluginId,
        locale: { lang, t: (key) => key },
        ipc: pluginIpc,
        navigate: dummyNavigate as NavigateFunction,
        hostActions,
      };
      const handles: PluginRendererHandles | undefined = plugin.renderer?.activate(ctx);
      const materialized = materializeRenderer(plugin.manifest, handles);
      if (materialized.issues.length) {
        throw new Error(materialized.issues.map((issue) => issue.message).join('\n'));
      }
      registry.registerBatch(plugin.manifest.pluginId, materialized.registrations);
      registered.push(plugin.manifest.pluginId);
    }
  } catch (error) {
    for (const pluginId of [...registered].reverse()) {
      registry.unregisterOwner(pluginId);
    }
    throw error;
  }

  for (const tool of activityWorkbenchTools) {
    const key = tool.workspaceKey || 'activity.capture';
    registry.register('host', extensionPoints.workspace, key, { ...tool, workspaceKey: key });
  }

  return new RendererPlatform({
    lang,
    registry,
    ipc,
    workspaceHost: createAiWorkspaceHost(),
  });
}

export function pluginViewPageHref(request: PluginViewOpenRequest) {
  const pluginId = request.viewId.split('.')[0] || '';
  return hrefFromSnapshot(pluginId, request);
}

export function pluginRoutes(): IRoute[] {
  return [
    {
      name: 'menu.ai',
      key: '/ai',
      meta: { icon: Sparkles },
      loader: () => import('@/features/ai'),
    } as IRoute,
    {
      name: 'menu.plugins',
      key: pluginPaths.root,
      meta: { icon: Blocks },
      loader: () => import('@/plugin/PluginsHome'),
    },
  ];
}

export function attachPageLoaders(routes: IRoute[]): IRoute[] {
  return routes.map((route) => {
    const loader = (route as IRoute & { loader?: () => Promise<{ default: unknown }> }).loader;
    const next = { ...route };
    if (loader) {
      (next as { component?: unknown }).component = lazyload(loader as never);
    }
    if (next.children) next.children = attachPageLoaders(next.children);
    return next;
  });
}
