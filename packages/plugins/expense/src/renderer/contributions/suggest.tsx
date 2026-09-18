import { Button, Flex, Input, InputNumber, message } from '@sue/design-web-react';
import { useState } from 'react';
import type { WorkbenchToolDefinition, WorkbenchToolProps } from '@true-north/plugin-sdk';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { contributionKey } from '@true-north/plugin-contract';

const KEY = contributionKey('expense', 'suggestTransaction');

function Workspace(props: WorkbenchToolProps<Record<string, unknown>>) {
  const hostActions = useHostActions();
  const [draft, setDraft] = useState(props.payload);
  const [busy, setBusy] = useState(false);
  if (props.payload.adopted || draft.adopted) return <p>已入账。</p>;
  return (
    <Flex vertical gap={12} style={{ padding: 16 }}>
      <Input value={String(draft.title || '')} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <InputNumber value={draft.amount as number | undefined} onChange={(value) => setDraft({ ...draft, amount: value })} />
      <Input value={String(draft.category || '')} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="分类" />
      <Button
        type="primary"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            if (!(Number(draft.amount) > 0)) {
              message.error('请填写大于零的金额');
              return;
            }
            const result = await props.actions.adopt({
              pluginId: 'expense',
              localId: 'createTransaction',
              input: draft,
            });
            if (result.status === 'applied' || result.status === 'noop') {
              message.success('已入账');
              setDraft({ ...draft, adopted: true, resource: result.resource });
              await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
            } else message.error('reason' in result ? result.reason : '未能入账');
          } finally {
            setBusy(false);
          }
        }}
      >
        确认入账
      </Button>
    </Flex>
  );
}

export const suggestTransactionTool: WorkbenchToolDefinition = {
  workspaceKey: KEY,
  title: (payload) => String(payload.title || '账单建议'),
  entryLabel: (payload) => `打开工作台：${payload.title || '账单建议'}`,
  autoOpen: ({ force }) => force,
  parsePayload: (payload) => payload,
  Component: Workspace,
};
