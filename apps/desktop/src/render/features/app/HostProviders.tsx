import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { HOST_AI_START, HOST_WORKFLOW_OPEN_PENDING, type PluginAiStartInput } from '@true-north/plugin-sdk';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { AiSessionProvider, useAiSessionContext } from '@/features/ai/context';
import { createHostWorkspaceHost } from '@/features/ai/workspace-host';
import { WorkbenchProvider } from '@/features/workbench';
import { WorkflowInteractionProvider, useOpenWorkflowInteraction } from '@/plugin/WorkflowInteractionHost';
import { useWorkbench } from '@/features/workbench';

function HostActionBindings({ children }: { children: ReactNode }) {
  const platform = useRendererPlatform();
  const openInteraction = useOpenWorkflowInteraction();
  const { openToolTab } = useWorkbench();
  const { startFromHost } = useAiSessionContext();

  useEffect(() => {
    return platform.hostActions.register(HOST_AI_START, async (raw) => {
      await startFromHost((raw || {}) as PluginAiStartInput);
    });
  }, [platform.hostActions, startFromHost]);

  useEffect(() => {
    return platform.hostActions.register(HOST_WORKFLOW_OPEN_PENDING, async () => {
      const workspaces = (await platform.ipc.get('/workflow/workspaces')) as {
        list?: Array<{ id: string; planId: string; contributionId: string; state?: Record<string, unknown> }>;
      };
      for (const item of workspaces?.list || []) {
        await openToolTab({
          conversationId: 'workflow',
          messageId: `workflow:${item.planId}`,
          workspaceId: item.id,
          workspaceKey: item.contributionId,
          title: String(item.state?.title || '确认工作台'),
          payload: item.state || {},
        });
      }
      const pending = (await platform.ipc.get('/workflow/pending')) as {
        list?: Array<{ edgeId: string; interactionId?: string; draft?: Record<string, unknown> }>;
      };
      for (const item of pending?.list || []) {
        if (!item.interactionId) continue;
        const [pluginId, ...rest] = item.interactionId.split('.');
        const submitted = await openInteraction(pluginId || '', rest.join('.'), item.draft);
        if (submitted) {
          await platform.ipc.post(`/workflow/edges/${item.edgeId}/interact`, submitted);
        }
      }
    });
  }, [openInteraction, openToolTab, platform.hostActions, platform.ipc]);

  return <>{children}</>;
}

export function HostProviders({ children }: { children: ReactNode }) {
  const platform = useRendererPlatform();
  const extract = platform.workbenchActions.find((action) => action.id.endsWith('.extract'));
  const pluginProviders = [...platform.shellSlots]
    .filter((slot) => slot.slot === 'app-providers')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const overlays = [...platform.shellSlots]
    .filter((slot) => slot.slot === 'page-overlay')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  let tree: ReactNode = (
    <>
      {overlays.map((slot) => {
        const Slot = slot.render;
        return <Slot key={`${slot.pluginId}:${slot.id}`} />;
      })}
      {children}
    </>
  );
  for (const slot of [...pluginProviders].reverse()) {
    const Slot = slot.render;
    tree = <Slot>{tree}</Slot>;
  }

  return (
    <WorkflowInteractionProvider>
      <WorkbenchProvider
        tools={(platform.workbenchTools || []) as never}
        workspaceHost={platform.state.workspaceHost || createHostWorkspaceHost(platform.ipc)}
        extractHandler={
          extract
            ? async (input) => {
                await extract.run(input as never);
              }
            : undefined
        }
      >
        <AiSessionProvider>
          <HostActionBindings>{tree}</HostActionBindings>
        </AiSessionProvider>
      </WorkbenchProvider>
    </WorkflowInteractionProvider>
  );
}
