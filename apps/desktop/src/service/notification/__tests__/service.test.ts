import assert from 'node:assert/strict';
import test from 'node:test';
import { sortInbox, pickDedupeRow } from '../inbox.ts';
import { namespacePluginDedupeKey } from '../dedupe.ts';
import { decidePostAction } from '../remind.ts';

test('inbox lists unread first, then newest', () => {
  const sorted = sortInbox([
    { id: 'old-unread', readAt: null, createdAt: '2026-09-14T08:00:00.000Z' },
    { id: 'read', readAt: '2026-09-16T10:00:00.000Z', createdAt: '2026-09-16T09:00:00.000Z' },
    { id: 'new-unread', readAt: null, createdAt: '2026-09-16T11:00:00.000Z' },
  ]);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ['new-unread', 'old-unread', 'read'],
  );
});

test('plugin dedupe keys are namespaced by pluginId', () => {
  assert.equal(namespacePluginDedupeKey('growth', 'todo:1'), 'growth:todo:1');
  assert.equal(namespacePluginDedupeKey('growth', 'growth:todo:1'), 'growth:todo:1');
  assert.equal(namespacePluginDedupeKey('growth', '  '), undefined);
  assert.equal(namespacePluginDedupeKey('growth'), undefined);
});

test('dismiss uses the same namespaced key the host would post', () => {
  const posted = namespacePluginDedupeKey('expense', 'transaction:abc');
  const dismissed = namespacePluginDedupeKey('expense', 'transaction:abc');
  assert.equal(posted, 'expense:transaction:abc');
  assert.equal(dismissed, posted);
});

test('tracked post updates the latest row with the same dedupe key, including read', () => {
  const existing = pickDedupeRow(
    [
      {
        id: 'older-unread',
        dedupeKey: 'growth:todo:1',
        readAt: null,
        createdAt: '2026-09-14T08:00:00.000Z',
      },
      {
        id: 'read',
        dedupeKey: 'growth:todo:1',
        readAt: '2026-09-16T10:00:00.000Z',
        createdAt: '2026-09-16T09:00:00.000Z',
      },
    ],
    'growth:todo:1',
  );
  assert.equal(existing?.id, 'read');
  assert.equal(existing?.readAt, '2026-09-16T10:00:00.000Z');
  assert.equal(pickDedupeRow([{ id: 'other', dedupeKey: 'x', createdAt: '2026-09-16T09:00:00.000Z' }], 'missing'), undefined);
});

test('remind skips muted or unread keys, then creates a new row after read', () => {
  assert.equal(decidePostAction({ mode: 'remind', muted: true, hasUnread: false, hasExisting: true }), 'skip');
  assert.equal(decidePostAction({ mode: 'remind', muted: false, hasUnread: true, hasExisting: true }), 'skip');
  assert.equal(decidePostAction({ mode: 'remind', muted: false, hasUnread: false, hasExisting: true }), 'create');
  assert.equal(decidePostAction({ mode: 'upsert', muted: false, hasUnread: false, hasExisting: true }), 'upsert');
  assert.equal(decidePostAction({ mode: 'upsert', muted: true, hasUnread: false, hasExisting: true }), 'skip');
});
