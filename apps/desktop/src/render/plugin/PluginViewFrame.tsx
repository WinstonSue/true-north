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
import type { CommandResult } from '@true-north/plugin-contract';
import lazyload from '@/utils/lazyload';
import { useOpenWorkflowInteraction } from './WorkflowInteractionHost';

type PendingInteraction = {
  edgeId: string;
  interactionId: string;
  draft?: Record<string, unknown>;
};

async function maybeSubmitPending(
  ipc: { get: (path: string) => Promise<{ list?: PendingInteraction[] }>; post: (path: string, body: unknown) => Promise<unknown> },
  openInteraction: (pluginId: string, localId: string, draft?: Record<string, unknown>) => Promise<Record<string, unknown> | null>,
  beforeIds: Set<string>,
) {
  const pending = await ipc.get('/workflow/pending');
  const next = (pending?.list || []).find((item) => !beforeIds.has(item.edgeId));
  if (!next?.interactionId) return;
  const [pluginId, ...rest] = next.interactionId.split('.');
  const submitted = await openInteraction(pluginId || '', rest.join('.'), next.draft);
  if (submitted) {
    await ipc.post(`/workflow/edges/${next.edgeId}/interact`, submitted);
  }
}

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
  const openInteraction = useOpenWorkflowInteraction();
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
    workflow: {
      runCommand: async (localId, input, options) => {
        const before = ((await platform.ipc.get('/workflow/pending')) as { list?: PendingInteraction[] })?.list || [];
        const result = (await platform.ipc.post('/workflow/commands/run', {
          pluginId,
          localId,
          input,
          idempotencyKey: options?.idempotencyKey,
          planId: options?.planId,
          nodeId: options?.nodeId,
        })) as CommandResult;
        await maybeSubmitPending(
          platform.ipc,
          openInteraction,
          new Set(before.map((item) => item.edgeId)),
        );
        return result;
      },
      openInteraction: (localId, draft) => openInteraction(pluginId, localId, draft),
    },
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
