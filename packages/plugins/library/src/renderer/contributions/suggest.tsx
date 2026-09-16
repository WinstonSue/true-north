import { Button, Flex, Input, message } from '@sue/design-web-react';
import { useState } from 'react';
import type { WorkbenchToolDefinition, WorkbenchToolProps } from '@true-north/plugin-sdk';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { contributionKey } from '@true-north/plugin-contract';

const KEY = contributionKey('library', 'suggestBookmark');

function Workspace(props: WorkbenchToolProps<Record<string, unknown>>) {
  const hostActions = useHostActions();
  const [draft, setDraft] = useState(props.payload);
  const [busy, setBusy] = useState(false);
  if (props.payload.adopted || draft.adopted) return <p>已收藏。</p>;
  return (
    <Flex vertical gap={12} style={{ padding: 16 }}>
      <Input value={String(draft.title || '')} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <Input value={String(draft.url || '')} onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
      <Button
        type="primary"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await props.actions.adopt({
              pluginId: 'library',
              localId: 'createBookmark',
              input: draft,
            });
            if (result.status === 'applied' || result.status === 'noop') {
              message.success('已收藏');
              setDraft({ ...draft, adopted: true, resource: result.resource });
              await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
            } else message.error('reason' in result ? result.reason : '未能收藏');
          } finally {
            setBusy(false);
          }
        }}
      >
        确认收藏
      </Button>
    </Flex>
  );
}

export const suggestBookmarkTool: WorkbenchToolDefinition = {
  workspaceKey: KEY,
  title: (payload) => String(payload.title || '收藏建议'),
  entryLabel: (payload) => `打开工作台：${payload.title || '收藏建议'}`,
  autoOpen: ({ force }) => force,
  parsePayload: (payload) => payload,
  Component: Workspace,
};
