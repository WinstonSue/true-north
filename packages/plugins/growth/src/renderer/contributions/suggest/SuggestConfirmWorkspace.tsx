import { Button, Flex, Input, InputNumber, message } from '@sue/design-web-react';
import { useState } from 'react';
import type { WorkbenchToolProps } from '@true-north/plugin-sdk';
import { HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';

type SuggestPayload = Record<string, unknown> & { title?: string; adopted?: boolean };

export function SuggestConfirmWorkspace({
  payload,
  actions,
  command,
  pluginId,
  fields,
  successText = '已确认并创建。',
  successToast = '已创建',
}: WorkbenchToolProps<SuggestPayload> & {
  command: string;
  pluginId: string;
  fields: Array<{ key: string; label: string; kind?: 'text' | 'number' }>;
  successText?: string;
  successToast?: string;
}) {
  const hostActions = useHostActions();
  const [draft, setDraft] = useState(payload);
  const [busy, setBusy] = useState(false);
  if (payload.adopted || draft.adopted) {
    return <p>{successText}</p>;
  }
  return (
    <Flex vertical gap={12} style={{ padding: 16 }}>
      {fields.map((field) => (
        <label key={field.key}>
          <div>{field.label}</div>
          {field.kind === 'number' ? (
            <InputNumber
              className="w-full"
              value={draft[field.key] as number | undefined}
              onChange={(value) => setDraft({ ...draft, [field.key]: value })}
            />
          ) : (
            <Input
              value={String(draft[field.key] ?? '')}
              onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
            />
          )}
        </label>
      ))}
      <Button
        type="primary"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await actions.adopt({ pluginId, localId: command, input: draft });
            if (result.status === 'applied' || result.status === 'noop') {
              message.success(successToast);
              setDraft({ ...draft, adopted: true, resource: result.resource });
              await hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING);
            } else {
              message.error('reason' in result ? result.reason : '未能创建');
            }
          } catch (error) {
            message.error(error instanceof Error ? error.message : '未能创建');
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
