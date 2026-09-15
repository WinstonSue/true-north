import { useMemo } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { hrefFromSnapshot, snapshotFromSearchParams, useLocale, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { TabsPage } from '@true-north/plugin-ui';
import lazyload from '@/utils/lazyload';
import { pluginPaths } from './paths';
import { PluginViewFrame } from './PluginViewFrame';

const NotFoundPage = lazyload(() => import('@/features/app/exception/404'));

export function PluginStage() {
  const { pluginKey } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useLocale();
  const platform = useRendererPlatform();
  const plugin = platform.plugins.find((entry) => entry.pluginId === pluginKey);
  const views = useMemo(
    () =>
      [...(platform.workbenchViews || [])]
        .filter((view) => view.pluginId === plugin?.pluginId)
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    [platform.workbenchViews, plugin?.pluginId],
  );
  const snapshot = useMemo(
    () => (plugin ? snapshotFromSearchParams(plugin.pluginId, views, searchParams) : null),
    [plugin, searchParams, views],
  );
  const activeView = views.find((view) => view.id === snapshot?.viewId);

  if (!plugin || !snapshot || !activeView) {
    return <NotFoundPage />;
  }

  return (
    <TabsPage
      tabs={views.map((view) => ({
        name: t[view.nameKey] || view.nameKey,
        key: view.id,
        active: view.id === activeView.id,
      }))}
      onSelect={(tab) => {
        const view = views.find((item) => item.id === tab.key);
        if (!view) return;
        navigate(hrefFromSnapshot(plugin.pluginId, { viewId: view.id, params: {} }));
      }}
    >
      <PluginViewFrame
        key={activeView.id}
        pluginId={plugin.pluginId}
        snapshot={snapshot}
        revision={0}
        mode="page"
        load={activeView.load}
        onParamsChange={(params) => {
          navigate(hrefFromSnapshot(plugin.pluginId, { viewId: snapshot.viewId, params }), { replace: true });
        }}
      />
    </TabsPage>
  );
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
