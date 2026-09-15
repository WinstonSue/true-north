import { Component, Fragment, useCallback, useMemo, type ComponentType, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PluginRuntimeProvider,
  PluginViewRuntimeProvider,
  hrefFromSnapshot,
  useRendererPlatform,
  type PluginRendererContext,
  type PluginViewMode,
  type PluginViewSnapshot,
} from '@true-north/plugin-sdk/renderer';
import lazyload from '@/utils/lazyload';

class PluginErrorBoundary extends Component<{ pluginId: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h2 className="text-title-2">插件 {this.props.pluginId} 出错</h2>
          <p className="text-text-3">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PluginRuntimeFrame({ pluginId, children }: { pluginId: string; children: ReactNode }) {
  const navigate = useNavigate();
  const platform = useRendererPlatform();
  const ctx: PluginRendererContext = {
    pluginId,
    locale: {
      lang: platform.state.lang,
      t: (key) => {
        const messages = platform.locales
          .filter((item) => item.pluginId === pluginId)
          .map((item) => item.messages[platform.state.lang] || {});
        return Object.assign({}, ...messages)[key] || key;
      },
    },
    ipc: platform.ipc,
    navigate,
    hostActions: platform.hostActions,
  };

  return (
    <PluginErrorBoundary key={pluginId} pluginId={pluginId}>
      <PluginRuntimeProvider value={ctx}>{children}</PluginRuntimeProvider>
    </PluginErrorBoundary>
  );
}

export function PluginViewContent({
  pluginId,
  snapshot,
  revision,
  mode,
  load,
  onParamsChange,
}: {
  pluginId: string;
  snapshot: PluginViewSnapshot;
  revision: number;
  mode: PluginViewMode;
  load: () => Promise<{ default: ComponentType }>;
  onParamsChange: (params: Record<string, string>) => void;
}) {
  const platform = useRendererPlatform();
  const View = useMemo(() => lazyload(load), [load]);
  const Scope = platform.scopes[pluginId] || Fragment;
  const setParams = useCallback(
    (params: Record<string, string>) => {
      onParamsChange(params);
    },
    [onParamsChange],
  );

  return (
    <Scope>
      <PluginViewRuntimeProvider
        value={{
          snapshot,
          revision,
          mode,
          setParams,
        }}
      >
        <View />
      </PluginViewRuntimeProvider>
    </Scope>
  );
}

export function PluginViewFrame({
  pluginId,
  snapshot,
  revision,
  mode,
  load,
  onParamsChange,
}: {
  pluginId: string;
  snapshot: PluginViewSnapshot;
  revision: number;
  mode: PluginViewMode;
  load: () => Promise<{ default: ComponentType }>;
  onParamsChange: (params: Record<string, string>) => void;
}) {
  return (
    <PluginRuntimeFrame pluginId={pluginId}>
      <PluginViewContent
        pluginId={pluginId}
        snapshot={snapshot}
        revision={revision}
        mode={mode}
        load={load}
        onParamsChange={onParamsChange}
      />
    </PluginRuntimeFrame>
  );
}

export function navigatePluginResource(
  navigate: ReturnType<typeof useNavigate>,
  platform: ReturnType<typeof useRendererPlatform>,
  uri?: string,
) {
  if (!uri) return false;
  const request = platform.openResource(uri);
  if (!request) return false;
  const pluginId = request.viewId.split('.')[0] || '';
  navigate(hrefFromSnapshot(pluginId, request));
  return true;
}
