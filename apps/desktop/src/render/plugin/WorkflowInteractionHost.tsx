import { Modal } from '@sue/design-web-react';
import { createContext, useCallback, useContext, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { contributionKey } from '@true-north/plugin-contract';
import { extensionPoints, type WorkflowInteractionProps } from '@true-north/plugin-sdk';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';

type OpenInteraction = (
  pluginId: string,
  localId: string,
  draft?: Record<string, unknown>,
) => Promise<Record<string, unknown> | null>;

const WorkflowInteractionContext = createContext<OpenInteraction | null>(null);

export function useOpenWorkflowInteraction(): OpenInteraction {
  const open = useContext(WorkflowInteractionContext);
  return open || (async () => null);
}

export function WorkflowInteractionProvider({ children }: { children: ReactNode }) {
  const platform = useRendererPlatform();
  const [session, setSession] = useState<{
    Component: ComponentType<WorkflowInteractionProps>;
    draft?: Record<string, unknown>;
    resolve: (value: Record<string, unknown> | null) => void;
  } | null>(null);

  const openInteraction = useCallback<OpenInteraction>(
    async (pluginId, localId, draft) => {
      const id = contributionKey(pluginId, localId);
      const extension = platform.state.registry.get(extensionPoints.workflowInteraction, id);
      if (!extension) return null;
      const loaded = await extension.load();
      return new Promise((resolve) => {
        setSession({ Component: loaded.default, draft, resolve });
      });
    },
    [platform.state.registry],
  );

  const close = (value: Record<string, unknown> | null) => {
    session?.resolve(value);
    setSession(null);
  };

  const value = useMemo(() => openInteraction, [openInteraction]);
  const Component = session?.Component;

  return (
    <WorkflowInteractionContext.Provider value={value}>
      {children}
      <Modal title="确认" open={Boolean(session)} footer={null} onCancel={() => close(null)}>
        {Component ? (
          <Component
            draft={session?.draft}
            onSubmit={async (input) => {
              close(input);
            }}
            onCancel={async () => {
              close(null);
            }}
          />
        ) : null}
      </Modal>
    </WorkflowInteractionContext.Provider>
  );
}
