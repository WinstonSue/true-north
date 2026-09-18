export type OutboxStatus = 'pending' | 'processed' | 'failed';

export type OutboxRecord = {
  id: string;
  eventId: string;
  type: string;
  payload: Record<string, unknown>;
  sourceUri?: string;
  status: OutboxStatus;
  attempts: number;
};

export type OutboxStore = {
  claimPending(limit: number): Promise<OutboxRecord[]>;
  markProcessed(id: string): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
};

export type HostEventInbox = {
  seen(eventId: string): Promise<boolean>;
  remember(eventId: string): Promise<void>;
};

/** 按批次领取 outbox，成功才标记 processed；失败累加 attempts。 */
export async function drainOutbox(
  store: OutboxStore,
  handler: (record: OutboxRecord) => Promise<void>,
  limit = 20,
): Promise<void> {
  const batch = await store.claimPending(limit);
  for (const record of batch) {
    try {
      await handler(record);
      await store.markProcessed(record.id);
    } catch (error) {
      await store.markFailed(record.id, error instanceof Error ? error.message : String(error));
    }
  }
}
