import type { WorkbenchToolDefinition, WorkbenchToolProps } from '@true-north/plugin-sdk';
import { Button, Flex } from '@sue/design-web-react';
import { WorkflowController } from '@true-north/web-service';

function ConflictResolutionWorkspace(props: WorkbenchToolProps<Record<string, unknown>>) {
  const payload = props.payload;
  if (payload.stale) return <p>工单已更新，这条建议已过期。</p>;
  return (
    <Flex vertical gap={8} style={{ padding: 16 }}>
      <p>建议动作：{String(payload.action)}</p>
      <p>{String(payload.reason || '')}</p>
      <Button
        type="primary"
        onClick={() =>
          void WorkflowController.resolve(String(payload.ticketId), {
            ticketRevision: Number(payload.ticketRevision),
            action: String(payload.action),
            expectedRevision: payload.resourceRevision ? String(payload.resourceRevision) : undefined,
          })
        }
      >
        到冲突面板确认
      </Button>
    </Flex>
  );
}

export const conflictResolutionTool: WorkbenchToolDefinition = {
  workspaceKey: 'workflow.conflictResolution',
  title: () => '冲突解决建议',
  entryLabel: () => '打开工作台：冲突解决建议',
  autoOpen: ({ force }) => force,
  parsePayload: (payload) => payload,
  Component: ConflictResolutionWorkspace,
};
