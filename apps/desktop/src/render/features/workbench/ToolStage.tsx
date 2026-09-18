import { useEffect, useState } from 'react';
import { message } from '@sue/design-web-react';
import type { CommandResult } from '@true-north/plugin-contract';
import { workspaceAdoptKey } from '@true-north/plugin-sdk';
import { useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import type { AiWorkspacePayloadVo } from '@true-north/vo';
import { useWorkbench, type WorkbenchToolTab } from './context';
import styles from './style.module.less';

function commandInputOf(raw: unknown) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { input: raw };
  const { adopted, resource, adoptedAt, planId, nodeId, workflowWorkspaceId, nodeKey, ...input } = raw as Record<string, unknown>;
  return {
    input,
    planId: typeof planId === 'string' ? planId : undefined,
    nodeId: typeof nodeId === 'string' ? nodeId : undefined,
  };
}

export function ToolStage({ tab }: { tab: WorkbenchToolTab }) {
  const { requestFollowUp, tools, workspaceHost } = useWorkbench();
  const platform = useRendererPlatform();
  const [payload, setPayload] = useState(tab.payload);
  const [workspaceKey, setWorkspaceKey] = useState(tab.workspaceKey);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(tab.payload);
    setWorkspaceKey(tab.workspaceKey);
  }, [tab.id, tab.payload, tab.workspaceKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await workspaceHost.load(tab.conversationId, tab.messageId, tab.workspaceId);
        if (cancelled) return;
        setError(null);
        setWorkspaceKey(next.workspaceKey);
        setPayload(next.payload);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '未找到对应的工作台内容');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab.conversationId, tab.messageId, tab.workspaceId, workspaceHost]);

  useEffect(() => {
    return workspaceHost.subscribe(tab.messageId, tab.workspaceId, (next) => {
      setWorkspaceKey(next.workspaceKey);
      setPayload(next.payload);
    });
  }, [tab.messageId, tab.workspaceId, workspaceHost]);

  const definition = tools.find(workspaceKey);

  const updatePayload = async (next: AiWorkspacePayloadVo) => {
    try {
      const saved = await workspaceHost.patch(tab.messageId, tab.workspaceId, next);
      setPayload(saved);
      return true;
    } catch (err) {
      message.error(err instanceof Error ? err.message : '保存失败');
      return false;
    }
  };

  let parsed: unknown = payload;
  let parseError: string | null = null;
  if (definition) {
    try {
      parsed = definition.parsePayload(payload);
    } catch (err) {
      parseError = err instanceof Error ? err.message : '工作台载荷无效';
    }
  }

  const Comp = definition?.Component;
  const displayError = error || parseError || (!definition ? `未知工作台类型：${workspaceKey}` : null);

  return (
    <div className={styles.toolStage}>
      {displayError ? (
        <p className={styles.toolStageError}>{displayError}</p>
      ) : Comp ? (
        <Comp
          payload={parsed as never}
          workspaceId={tab.workspaceId}
          messageId={tab.messageId}
          conversationId={tab.conversationId}
          actions={{
            updatePayload,
            requestFollowUp: (text) => requestFollowUp(tab.conversationId, text),
            adopt: async ({ pluginId, localId, input }) => {
              const command = commandInputOf(input);
              const result = await platform.ipc.post<CommandResult>('/workflow/commands/run', {
                pluginId,
                localId,
                input: command.input,
                workspaceId: tab.workspaceId,
                planId: command.planId,
                nodeId: command.nodeId,
                idempotencyKey: workspaceAdoptKey(tab.workspaceId, pluginId, localId),
              });
              if (result.status === 'applied' || result.status === 'noop') {
                const current =
                  parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                    ? (parsed as Record<string, unknown>)
                    : {};
                await updatePayload({
                  ...current,
                  adopted: true,
                  resource: result.resource,
                  adoptedAt: new Date().toISOString(),
                });
              }
              return result;
            },
          }}
        />
      ) : (
        <p className={styles.toolStageError}>未知工作台类型：{workspaceKey}</p>
      )}
    </div>
  );
}
