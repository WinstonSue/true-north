import { Sparkles, Blocks } from 'lucide-react';
import type { NavigateFunction } from 'react-router-dom';
import {
  assemblePluginCatalog,
  HostActionRegistry,
  hrefFromSnapshot,
  materializeRenderer,
  pluginPath,
  prefixPluginIpc,
  type PluginIpcPort,
  type PluginRendererContext,
  type PluginRendererHandles,
  type PluginRuntimeEntry,
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

  const hostActions = new HostActionRegistry();
  const ipc = createRendererIpcPort();
  const handlesById = new Map<string, PluginRendererHandles>();
  const materializedById = new Map<string, ReturnType<typeof materializeRenderer>>();

  for (const plugin of catalog.plugins) {
    const pluginIpc = prefixPluginIpc(ipc, `/${plugin.manifest.pluginId}`);
    const ctx: PluginRendererContext = {
      pluginId: plugin.manifest.pluginId,
      locale: { lang, t: (key) => key },
      ipc: pluginIpc,
      navigate: dummyNavigate as NavigateFunction,
      hostActions,
    };
    const handles = plugin.renderer?.activate(ctx);
    const materialized = materializeRenderer(plugin.manifest, handles);
    if (materialized.issues.length) {
      throw new Error(materialized.issues.map((issue) => issue.message).join('\n'));
    }
    if (handles) handlesById.set(plugin.manifest.pluginId, handles);
    materializedById.set(plugin.manifest.pluginId, materialized);
  }

  const plugins = catalog.plugins
    .map((plugin): PluginRuntimeEntry => {
      const handles = handlesById.get(plugin.manifest.pluginId)!;
      return {
        pluginId: plugin.manifest.pluginId,
        nameKey: plugin.manifest.catalog.nameKey,
        path: pluginPath(plugin.manifest.pluginId),
        order: plugin.manifest.catalog.order,
        icon: handles.icon,
        descriptionKey: plugin.manifest.catalog.descriptionKey,
        categoryKey: plugin.manifest.catalog.categoryKey,
        keywords: plugin.manifest.catalog.keywords,
      };
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const openers = catalog.plugins.map((plugin) => {
    const handles = handlesById.get(plugin.manifest.pluginId);
    return handles?.openResource;
  });

  return new RendererPlatform({
    lang,
    plugins,
    shellSlots: catalog.plugins.flatMap((plugin) => materializedById.get(plugin.manifest.pluginId)?.shellSlots || []),
    workbenchTools: [
      ...activityWorkbenchTools,
      ...catalog.plugins.flatMap((plugin) => materializedById.get(plugin.manifest.pluginId)?.workspaces || []),
    ],
    workbenchActions: catalog.plugins.flatMap((plugin) => materializedById.get(plugin.manifest.pluginId)?.actions || []),
    workbenchViews: catalog.plugins.flatMap((plugin) => materializedById.get(plugin.manifest.pluginId)?.views || []),
    locales: catalog.plugins.flatMap((plugin) => handlesById.get(plugin.manifest.pluginId)?.locales || []),
    scopes: Object.fromEntries(
      catalog.plugins.flatMap((plugin) => {
        const scope = handlesById.get(plugin.manifest.pluginId)?.scope;
        return scope ? [[plugin.manifest.pluginId, scope]] : [];
      }),
    ),
    openResource: (uri: string): PluginViewOpenRequest | null => {
      for (const open of openers) {
        const request = open?.(uri);
        if (request) return request;
      }
      return null;
    },
    ipc,
    hostActions,
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
