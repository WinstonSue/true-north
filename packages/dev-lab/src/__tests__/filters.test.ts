import assert from 'node:assert/strict';
import test from 'node:test';
import type { TraceEntry } from '../types.ts';
import {
  collectTypeOptions,
  entryStatus,
  filterEntries,
  requestTypeLabel,
  requestTypeOf,
} from '../panel/filters.ts';

function entry(partial: Partial<TraceEntry> & Pick<TraceEntry, 'id' | 'kind'>): TraceEntry {
  return {
    startedAt: 0,
    spans: [],
    ...partial,
  };
}

test('requestTypeOf uses IPC method, otherwise kind', () => {
  assert.equal(requestTypeOf(entry({ id: '1', kind: 'ipc', method: 'post' })), 'POST');
  assert.equal(requestTypeOf(entry({ id: '2', kind: 'ipc' })), 'IPC');
  assert.equal(requestTypeOf(entry({ id: '3', kind: 'sql' })), 'sql');
});

test('requestTypeLabel maps kinds and leaves methods intact', () => {
  assert.equal(requestTypeLabel('ipc'), 'IPC');
  assert.equal(requestTypeLabel('sql'), 'SQL');
  assert.equal(requestTypeLabel('POST'), 'POST');
});

test('entryStatus maps open, error, and success', () => {
  assert.equal(entryStatus(entry({ id: '1', kind: 'ipc', open: true })), 'pending');
  assert.equal(entryStatus(entry({ id: '2', kind: 'ipc', ok: false })), 'error');
  assert.equal(entryStatus(entry({ id: '3', kind: 'ipc', error: 'TIMEOUT' })), 'error');
  assert.equal(entryStatus(entry({ id: '4', kind: 'ipc', ok: true })), 'ok');
  assert.equal(entryStatus(entry({ id: '5', kind: 'ipc' })), 'ok');
});

test('collectTypeOptions is unique and sorted by label', () => {
  const options = collectTypeOptions([
    entry({ id: '1', kind: 'sql' }),
    entry({ id: '2', kind: 'ipc', method: 'GET' }),
    entry({ id: '3', kind: 'ipc', method: 'GET' }),
    entry({ id: '4', kind: 'spawn' }),
  ]);
  assert.deepEqual(
    options.map((option) => option.value),
    ['GET', 'spawn', 'sql'],
  );
});

test('filterEntries matches type and status together', () => {
  const entries = [
    entry({ id: 'ok-get', kind: 'ipc', method: 'GET', ok: true }),
    entry({ id: 'fail-post', kind: 'ipc', method: 'POST', ok: false }),
    entry({ id: 'pending-sql', kind: 'sql', open: true }),
  ];
  assert.deepEqual(
    filterEntries(entries, { type: 'POST', status: 'error' }).map((item) => item.id),
    ['fail-post'],
  );
  assert.deepEqual(
    filterEntries(entries, { status: 'pending' }).map((item) => item.id),
    ['pending-sql'],
  );
  assert.equal(filterEntries(entries, {}).length, 3);
});
