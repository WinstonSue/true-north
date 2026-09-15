import { Component, type ComponentType, type ReactNode, useMemo } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  PluginRuntimeProvider,
  useRendererPlatform,
  type PluginRendererContext,
} from '@true-north/plugin-sdk/renderer';
import lazyload from '@/utils/lazyload';
import { pluginPaths } from './paths';

const NotFoundPage = lazyload(() => import('@/features/app/exception/404'));

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

export function PluginLazyStage({
  pluginId,
  load,
}: {
  pluginId: string;
  load: () => Promise<{ default: ComponentType }>;
}) {
  const Component = useMemo(() => lazyload(load), [load]);
  return (
    <PluginRuntimeFrame pluginId={pluginId}>
      <Component />
    </PluginRuntimeFrame>
  );
}

export function PluginStage() {
  const { pluginKey } = useParams();
  const plugin = useRendererPlatform().plugins.find((entry) => entry.pluginId === pluginKey);
  const load = plugin?.load;

  if (!plugin || !load) {
    return <NotFoundPage />;
  }

  return <PluginLazyStage pluginId={plugin.pluginId} load={load} />;
}

export function LegacyPluginPathRedirect() {
  const { pluginKey } = useParams();
  const location = useLocation();
  const plugin = useRendererPlatform().plugins.find((entry) => entry.pluginId === pluginKey);
  if (!plugin) {
    return <Navigate to={pluginPaths.root} replace />;
  }
  return <Navigate to={`${plugin.path}${location.search}${location.hash}`} replace />;
}
