import { Button, Flex } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { EmptyState } from '@true-north/plugin-ui';
import { HOST_AI_START, HOST_WORKFLOW_OPEN_PENDING } from '@true-north/plugin-sdk';
import { useHostActions } from '@true-north/plugin-sdk/renderer';
import { WorkflowController } from '@true-north/web-service';
import { useEffect, useState } from 'react';
import { conflictResourceUri, WORKFLOW_CONFLICT_SKILL_ID } from '../../plugin/host-ids';
import useLocale from '@/utils/useLocale';
import styles from '../features/workflow/style.module.less';

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
  const t = useLocale();
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

  return (
    <ProductSurface id={productRef('workflow.view.conflicts')}>
      <Flex vertical container="full" className={styles.page}>
        <Flex vertical container="fill" className={styles.body} gap={16}>
          {!tickets.length && !pending.length ? (
            <EmptyState description={t['workflow.issues.empty'] || '没有待处理的确认或冲突'} />
          ) : null}
          {pending.map((item) => (
            <Flex key={item.edgeId} vertical gap={8} className={styles.issueCard}>
              <strong>{t['workflow.issues.pending'] || '待确认结算'}</strong>
              <span className={styles.muted}>{String(item.draft?.title || item.interactionId || '')}</span>
              <Button
                type="primary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => void hostActions.invoke(HOST_WORKFLOW_OPEN_PENDING).then(refresh)}
              >
                {t['workflow.issues.openConfirm'] || '打开确认'}
              </Button>
            </Flex>
          ))}
          {tickets.map((ticket) => (
            <Flex key={ticket.ticketId} vertical gap={8} className={styles.issueCard}>
              <strong>
                {t['workflow.issues.conflict'] || '冲突'} {ticket.resultStatus}
              </strong>
              <span className={styles.muted}>{ticket.reason}</span>
              <Flex gap={8} wrap>
                {(ticket.allowedActions || ['acceptCurrent']).map((action) => (
                  <Button
                    key={action}
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
                  onClick={() =>
                    void hostActions.invoke(HOST_AI_START, {
                      uri: conflictResourceUri(ticket.ticketId),
                      label: t['workflow.issues.askAi'] || '冲突排查',
                      skill: WORKFLOW_CONFLICT_SKILL_ID,
                      kickoff: '请读取最新冲突工单和相关资源，只提出工单允许的解决建议。',
                    })
                  }
                >
                  {t['workflow.issues.askAi'] || '问 AI'}
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </ProductSurface>
  );
}
