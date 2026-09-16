import { useMemo } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { hrefFromLocation, locationFromSearchParams, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import lazyload from '@/utils/lazyload';
import { pluginPaths } from './paths';
import { PluginRuntimeFrame } from './PluginViewFrame';

const NotFoundPage = lazyload(() => import('@/features/app/exception/404'));

export function PluginStage() {
  const { pluginKey } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const platform = useRendererPlatform();
  const plugin = platform.plugins.find((entry) => entry.pluginId === pluginKey);
  const page = plugin ? platform.hubs.find((entry) => entry.pluginId === plugin.pluginId) : undefined;
  const Page = useMemo(() => (page ? lazyload(page.load) : null), [page]);
  const location = useMemo(() => locationFromSearchParams(searchParams), [searchParams]);

  if (!plugin || !Page) {
    return <NotFoundPage />;
  }

  return (
    <PluginRuntimeFrame pluginId={plugin.pluginId}>
      <Page
        location={location}
        navigate={(next) => navigate(hrefFromLocation(plugin.pluginId, next))}
      />
    </PluginRuntimeFrame>
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
