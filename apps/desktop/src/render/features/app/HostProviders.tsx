import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOST_AI_START, type PluginAiStartInput } from '@true-north/plugin-sdk';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import { AiService } from '@true-north/web-service';
import { AiSessionProvider } from '@/features/ai/context';
import { createAiWorkspaceHost } from '@/features/ai/workspace-host';
import { WorkbenchProvider } from '@/features/workbench';

export function HostProviders({ children }: { children: ReactNode }) {
  const platform = useRendererPlatform();
  const navigate = useNavigate();
  const extract = platform.workbenchActions.find((action) => action.id.endsWith('.extract'));
  const pluginProviders = [...platform.shellSlots]
    .filter((slot) => slot.slot === 'app-providers')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const overlays = [...platform.shellSlots]
    .filter((slot) => slot.slot === 'page-overlay')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    return platform.hostActions.register(HOST_AI_START, async (raw) => {
      const input = (raw || {}) as PluginAiStartInput;
      if (!input.uri) return;
      const bound = await AiService.ensureResourceConversation({
        uri: input.uri,
        label: input.label,
        skill: input.skill,
      });
      if (bound.ok === false) return;
      const conversationId = bound.data.conversation.id;
      if (input.message && bound.data.created) {
        await AiService.startMessageStream(conversationId, { text: input.message });
      }
      navigate(`/ai?conversationId=${encodeURIComponent(conversationId)}`);
    });
  }, [navigate, platform.hostActions]);

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
    <WorkbenchProvider
      tools={(platform.workbenchTools || []) as never}
      views={platform.workbenchViews || []}
      workspaceHost={platform.state.workspaceHost || createAiWorkspaceHost()}
      extractHandler={
        extract
          ? async (input) => {
              await extract.run(input as never);
            }
          : undefined
      }
    >
      <AiSessionProvider>{tree}</AiSessionProvider>
    </WorkbenchProvider>
  );
}
