import { Button, Flex, Input, InputNumber, Select, message } from '@sue/design-web-react';
import { useState } from 'react';
import type { WorkbenchToolDefinition, WorkbenchToolProps } from '@true-north/plugin-sdk';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { contributionKey } from '@true-north/plugin-contract';

const ITEM_KEY = contributionKey('inventory', 'suggestItem');
const MOVEMENT_KEY = contributionKey('inventory', 'suggestMovement');

function SuggestItemWorkspace(props: WorkbenchToolProps<Record<string, unknown>>) {
  const hostActions = useHostActions();
  const [draft, setDraft] = useState(props.payload);
  const [busy, setBusy] = useState(false);
  if (props.payload.adopted || draft.adopted) return <p>已确认并创建物资。</p>;
  return (
    <Flex vertical gap={12} style={{ padding: 16 }}>
      <Input value={String(draft.title || '')} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="名称" />
      <Input value={String(draft.unit || '')} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} placeholder="单位" />
      <InputNumber value={draft.minStock as number | undefined} onChange={(value) => setDraft({ ...draft, minStock: value })} placeholder="库存下限" />
      <InputNumber value={draft.targetStock as number | undefined} onChange={(value) => setDraft({ ...draft, targetStock: value })} placeholder="目标量" />
      <InputNumber value={draft.quantity as number | undefined} onChange={(value) => setDraft({ ...draft, quantity: value })} placeholder="当前数量" />
      <Input value={String(draft.locationName || '')} onChange={(event) => setDraft({ ...draft, locationName: event.target.value })} placeholder="位置" />
      <Button
        type="primary"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await props.actions.adopt({ pluginId: 'inventory', localId: 'createItem', input: draft });
            if (result.status === 'applied' || result.status === 'noop') {
              message.success('已创建物资');
              setDraft({ ...draft, adopted: true, resource: result.resource });
              await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
            } else message.error('reason' in result ? result.reason : '未能创建');
          } finally {
            setBusy(false);
          }
        }}
      >
        确认创建
      </Button>
    </Flex>
  );
}

function SuggestMovementWorkspace(props: WorkbenchToolProps<Record<string, unknown>>) {
  const hostActions = useHostActions();
  const [draft, setDraft] = useState(props.payload);
  const [busy, setBusy] = useState(false);
  if (props.payload.adopted || draft.adopted) return <p>已确认库存变动。</p>;
  const command =
    draft.type === 'outbound' ? 'recordOutbound' : draft.type === 'adjust' ? 'adjustStock' : 'recordInbound';
  return (
    <Flex vertical gap={12} style={{ padding: 16 }}>
      <Select
        value={String(draft.type || 'inbound')}
        onChange={(value) => setDraft({ ...draft, type: value })}
        options={[
          { value: 'inbound', label: '入库' },
          { value: 'outbound', label: '出库' },
          { value: 'adjust', label: '盘点' },
        ]}
      />
      <InputNumber value={draft.quantity as number | undefined} onChange={(value) => setDraft({ ...draft, quantity: value })} placeholder="数量" />
      <InputNumber value={draft.targetQuantity as number | undefined} onChange={(value) => setDraft({ ...draft, targetQuantity: value })} placeholder="盘点后数量" />
      <Input value={String(draft.locationName || '')} onChange={(event) => setDraft({ ...draft, locationName: event.target.value })} placeholder="位置" />
      <Button
        type="primary"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await props.actions.adopt({ pluginId: 'inventory', localId: command, input: draft });
            if (result.status === 'applied' || result.status === 'noop') {
              message.success('已记录变动');
              setDraft({ ...draft, adopted: true, resource: result.resource });
              await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
            } else message.error('reason' in result ? result.reason : '未能记录');
          } finally {
            setBusy(false);
          }
        }}
      >
        确认变动
      </Button>
    </Flex>
  );
}

export const suggestItemTool: WorkbenchToolDefinition = {
  workspaceKey: ITEM_KEY,
  title: (payload) => String(payload.title || '物资建议'),
  entryLabel: (payload) => `打开工作台：${payload.title || '物资建议'}`,
  autoOpen: ({ force }) => force,
  parsePayload: (payload) => payload,
  Component: SuggestItemWorkspace,
};

export const suggestMovementTool: WorkbenchToolDefinition = {
  workspaceKey: MOVEMENT_KEY,
  title: (payload) => String(payload.title || payload.type || '库存变动'),
  entryLabel: (payload) => `打开工作台：${payload.title || payload.type || '库存变动'}`,
  autoOpen: ({ force }) => force,
  parsePayload: (payload) => payload,
  Component: SuggestMovementWorkspace,
};
