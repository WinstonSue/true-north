import { useContext, type ComponentType, type ReactNode } from 'react';
import { createHostActionPort, extensionPoints, openRegisteredResource } from '../extension-points.ts';
import { sharedReactContext } from './shared-context.ts';
import { type ExtensionRegistry } from '../extension-registry.ts';
import type {
  HostActionPort,
  LocaleContribution,
  PluginIpcPort,
  PluginRendererContext,
  PluginRuntimeEntry,
  PluginViewOpenRequest,
  ShellSlotContribution,
  WorkbenchToolDefinition,
  WorkbenchViewContribution,
  WorkbenchWorkspaceHost,
} from '../runtime.ts';

export type RendererPlatformState = {
  lang: string;
  hostMessages?: Record<string, Record<string, string>>;
  registry: ExtensionRegistry;
  ipc: PluginIpcPort;
  workspaceHost?: WorkbenchWorkspaceHost;
  error?: string;
};

export class RendererPlatform {
  readonly hostActions: HostActionPort;

  constructor(public readonly state: RendererPlatformState) {
    this.hostActions = createHostActionPort(state.registry, 'host');
  }

  get plugins(): PluginRuntimeEntry[] {
    return this.state.registry.list(extensionPoints.plugin);
  }

  get shellSlots(): ShellSlotContribution[] {
    return this.state.registry.list(extensionPoints.shellSlot);
  }

  get workbenchTools(): WorkbenchToolDefinition[] {
    return this.state.registry.list(extensionPoints.workspace);
  }

  get workbenchActions() {
    return this.state.registry.list(extensionPoints.workbenchAction);
  }

  get workbenchViews(): WorkbenchViewContribution[] {
    return this.state.registry.list(extensionPoints.view);
  }

  get pageShells() {
    return this.state.registry.list(extensionPoints.pageShell);
  }

  get locales(): LocaleContribution[] {
    return this.state.registry.list(extensionPoints.locale);
  }

  get ipc() {
    return this.state.ipc;
  }

  get error() {
    return this.state.error;
  }

  get scopes(): Record<string, ComponentType<{ children?: ReactNode }>> {
    return Object.fromEntries(
      this.state.registry.list(extensionPoints.scope).map((item) => [item.pluginId, item.Component]),
    );
  }

  openResource(uri: string) {
    return openRegisteredResource(this.state.registry, uri);
  }
}

const RendererPlatformContext = sharedReactContext<RendererPlatform | null>(
  '__true_north_renderer_platform_context__',
  null,
);
const PluginRuntimeContext = sharedReactContext<PluginRendererContext | null>(
  '__true_north_plugin_runtime_context__',
  null,
);

export function RendererPlatformProvider({
  platform,
  children,
}: {
  platform: RendererPlatform;
  children: ReactNode;
}) {
  return <RendererPlatformContext.Provider value={platform}>{children}</RendererPlatformContext.Provider>;
}

export function PluginRuntimeProvider({
  value,
  children,
}: {
  value: PluginRendererContext;
  children: ReactNode;
}) {
  return <PluginRuntimeContext.Provider value={value}>{children}</PluginRuntimeContext.Provider>;
}

export function useRendererPlatform(): RendererPlatform {
  const platform = useContext(RendererPlatformContext);
  if (!platform) throw new Error('RendererPlatform is not available');
  return platform;
}

export function useRendererPlatformOptional(): RendererPlatform | null {
  return useContext(RendererPlatformContext);
}

export function usePluginRuntime(): PluginRendererContext {
  const ctx = useContext(PluginRuntimeContext);
  if (!ctx) throw new Error('Plugin runtime is not available');
  return ctx;
}

export function usePluginRuntimeOptional(): PluginRendererContext | null {
  return useContext(PluginRuntimeContext);
}

export function usePluginIpc(): PluginIpcPort {
  const plugin = usePluginRuntimeOptional();
  if (plugin) return plugin.ipc;
  return useRendererPlatform().ipc;
}

export function useHostActions(): HostActionPort {
  const plugin = usePluginRuntimeOptional();
  if (plugin) return plugin.hostActions;
  return useRendererPlatform().hostActions;
}

export function useLocale(override?: Record<string, Record<string, string>> | null): Record<string, string> {
  const platform = useRendererPlatformOptional();
  const plugin = usePluginRuntimeOptional();
  const lang = plugin?.locale.lang || platform?.state.lang || 'zh-CN';
  if (override) return override[lang] || {};
  const host = platform?.state.hostMessages?.[lang] || {};
  const pluginMessages = (platform?.locales || []).map((item) => item.messages[lang] || {});
  return Object.assign({}, ...pluginMessages, host);
}
