import { Button, Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { HOST_AI_START, HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { WorkflowController } from '@true-north/web-service';
import { useEffect, useState } from 'react';
import { conflictResourceUri, WORKFLOW_CONFLICT_SKILL_ID } from '../../plugin/host-ids';

type Ticket = {
  ticketId: string;
  ticketRevision: number;
  reason?: string;
  resultStatus: string;
  targetUri?: string;
  allowedActions?: string[];
};

type Pending = {
  edgeId: string;
  interactionId?: string;
  draft?: Record<string, unknown>;
};

export function ConflictPanel() {
  const hostActions = useHostActions();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const refresh = () => {
    void WorkflowController.conflicts().then((result) => setTickets((result?.list || []) as Ticket[]));
    void WorkflowController.pending().then((result) => setPending((result?.list || []) as Pending[]));
  };
  useEffect(() => {
    refresh();
  }, []);
  if (!tickets.length && !pending.length) return null;
  return (
    <ProductSurface id={productRef('plugins.view.conflicts')}>
    <Flex vertical gap={8} style={{ padding: '8px 0' }}>
      {pending.map((item) => (
        <Flex key={item.edgeId} vertical gap={4}>
          <strong>待确认结算</strong>
          <span>{String(item.draft?.title || item.interactionId || '')}</span>
          <Button size="small" onClick={() => void hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING).then(refresh)}>
            打开确认
          </Button>
        </Flex>
      ))}
      {tickets.map((ticket) => (
        <Flex key={ticket.ticketId} vertical gap={4}>
          <strong>冲突 {ticket.resultStatus}</strong>
          <span>{ticket.reason}</span>
          <Flex gap={8} wrap>
            {(ticket.allowedActions || ['acceptCurrent']).map((action) => (
              <Button
                key={action}
                size="small"
                onClick={() =>
                  void WorkflowController.resolve(ticket.ticketId, {
                    ticketRevision: ticket.ticketRevision,
                    action,
                  }).then(refresh)
                }
              >
                {action}
              </Button>
            ))}
            <Button
              size="small"
              onClick={() =>
                void hostActions.invoke(HOST_AI_START, {
                  uri: conflictResourceUri(ticket.ticketId),
                  label: '冲突排查',
                  skill: WORKFLOW_CONFLICT_SKILL_ID,
                  kickoff: '请读取最新冲突工单和相关资源，只提出工单允许的解决建议。',
                })
              }
            >
              问 AI
            </Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
    </ProductSurface>
  );
}
