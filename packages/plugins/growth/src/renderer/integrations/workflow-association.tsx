import { useEffect, useState } from 'react';
import { Button, Flex, Modal, Select } from '@sue/design-web-react';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions, useLocale, useRendererPlatform } from '@true-north/plugin-sdk/renderer';
import type { PluginIpcPort } from '@true-north/plugin-sdk';

type PublishedDefinition = { id: string; title: string; status: string; sourceTemplateKey?: string };

export const TODO_COMPLETE_EXPENSE_TEMPLATE_KEY = 'expense.todoCompleteExpenseConfirm';

export async function listPublishedDefinitions(ipc: PluginIpcPort) {
  const result = (await ipc.get('/workflow/definitions')) as { list?: PublishedDefinition[] };
  return (result.list || []).filter((item) => item.status === 'published');
}

export async function findPublishedDefinitionByTemplateKey(
  ipc: PluginIpcPort,
  sourceTemplateKey: string,
) {
  const list = await listPublishedDefinitions(ipc);
  return list.find((item) => item.sourceTemplateKey === sourceTemplateKey)?.id;
}

export async function loadTodoAssociation(ipc: PluginIpcPort, ownerId: string) {
  const result = (await ipc.get('/workflow/associations', {
    ownerPluginId: 'growth',
    ownerKind: 'todo',
    ownerId,
  })) as { list?: Array<{ definitionId: string }> };
  return result.list?.[0]?.definitionId || null;
}

export async function saveTodoAssociation(ipc: PluginIpcPort, ownerId: string, definitionId: string | null) {
  await ipc.put('/workflow/associations', {
    ownerPluginId: 'growth',
    ownerKind: 'todo',
    ownerId,
    definitionId,
    versionPolicy: 'latest_published',
  });
}

export async function rollbackTodoWorkflows(ipc: PluginIpcPort, ownerId: string) {
  const preview = (await ipc.get('/workflow/rollback/preview', {
    ownerPluginId: 'growth',
    ownerKind: 'todo',
    ownerId,
  })) as { needsConfirm?: boolean; plans?: Array<{ id: string }> };
  if (!preview?.needsConfirm) return { needed: false as const };
  return { needed: true as const, plans: preview.plans || [] };
}

export async function confirmRollbackPlans(ipc: PluginIpcPort, plans: Array<{ id: string }>) {
  for (const plan of plans) {
    const result = (await ipc.post(`/workflow/plans/${plan.id}/rollback`, { confirmed: true })) as {
      status?: string;
      reason?: string;
    };
    if (result?.status === 'conflict' || result?.status === 'rejected') {
      throw new Error(result.reason || '回滚未能完成');
    }
  }
}

export async function detachWorkflowPlans(ipc: PluginIpcPort, plans: Array<{ id: string }>) {
  for (const plan of plans) {
    await ipc.post(`/workflow/plans/${plan.id}/detach`);
  }
}

export async function openPendingWorkflows(invoke: (name: string) => Promise<unknown>) {
  await invoke(HOST_WORKFLOW_OPEN_PENDING);
}

export function useOpenPendingWorkflows() {
  const hostActions = useHostActions();
  return () => openPendingWorkflows((name) => hostActions.invoke(name));
}

export type WorkflowDecision = 'rollback' | 'keep' | 'cancel';

export function confirmTodoWorkflowDecision(options: {
  ipc: PluginIpcPort;
  ownerId: string;
  title: string;
  content: string;
}): Promise<WorkflowDecision> {
  return new Promise((resolve) => {
    void rollbackTodoWorkflows(options.ipc, options.ownerId).then((preview) => {
      if (!preview.needed) {
        resolve('keep');
        return;
      }
      const instance = Modal.confirm({
        title: options.title,
        content: options.content,
        okCancel: false,
        footer: (
          <Flex justify="end" gap={8} wrap>
            <Button
              onClick={() => {
                instance.destroy();
                resolve('cancel');
              }}
            >
              取消
            </Button>
            <Button
              onClick={async () => {
                await detachWorkflowPlans(options.ipc, preview.plans);
                instance.destroy();
                resolve('keep');
              }}
            >
              保留流程结果并继续
            </Button>
            <Button
              type="primary"
              danger
              onClick={async () => {
                await confirmRollbackPlans(options.ipc, preview.plans);
                instance.destroy();
                resolve('rollback');
              }}
            >
              回滚流程并继续
            </Button>
          </Flex>
        ),
      });
    });
  });
}

export function WorkflowAssociationField(props: {
  value?: string | null;
  onChange: (definitionId: string | undefined) => void;
}) {
  const platform = useRendererPlatform();
  const t = useLocale();
  const [options, setOptions] = useState<PublishedDefinition[]>([]);
  useEffect(() => {
    void listPublishedDefinitions(platform.ipc).then(setOptions);
  }, [platform.ipc]);
  return (
    <Select
      allowClear
      className="w-full"
      placeholder="完成时发起的流程（可选）"
      value={props.value || undefined}
      options={options.map((item) => ({ label: t[item.title] || item.title, value: item.id }))}
      onChange={(value) => props.onChange(value || undefined)}
    />
  );
}
