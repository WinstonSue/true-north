import assert from 'node:assert/strict';
import test from 'node:test';
import { drainOutbox, type OutboxRecord, type OutboxStore } from '../src/host/event-outbox.ts';

test('drainOutbox marks processed records and retries failures', async () => {
  const records: OutboxRecord[] = [
    { id: 'ok', eventId: 'e1', type: 'growth.todoCompleted', payload: {}, status: 'pending', attempts: 0 },
    { id: 'bad', eventId: 'e2', type: 'growth.todoCompleted', payload: {}, status: 'pending', attempts: 0 },
  ];
  const processed: string[] = [];
  const failed: string[] = [];
  const store: OutboxStore = {
    async claimPending() {
      return records.filter((item) => item.status === 'pending');
    },
    async markProcessed(id) {
      processed.push(id);
    },
    async markFailed(id) {
      failed.push(id);
    },
  };
  await drainOutbox(store, async (record) => {
    if (record.id === 'bad') throw new Error('boom');
  });
  assert.deepEqual(processed, ['ok']);
  assert.deepEqual(failed, ['bad']);
});
