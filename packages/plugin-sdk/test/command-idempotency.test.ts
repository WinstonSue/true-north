import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decideHostAttemptReplay,
  hashCommandInput,
  nextRevision,
  revisionOf,
  replayLedgerResult,
  workspaceAdoptKey,
} from '../src/host/command-idempotency.ts';

test('revision helpers start at 1 and increment', () => {
  assert.equal(revisionOf(undefined), '1');
  assert.equal(revisionOf(1), '1');
  assert.equal(nextRevision(1), 2);
  assert.equal(nextRevision(undefined), 2);
});

test('ledger replay rejects the same key with a different payload', () => {
  const first = hashCommandInput({ title: 'a' });
  const second = hashCommandInput({ title: 'b' });
  const result = replayLedgerResult(
    { inputHash: first, result: { status: 'applied', resource: { uri: 'tn://growth/todos/1', revision: '1' } } },
    second,
  );
  assert.equal(result.status, 'rejected');
  if (result.status === 'rejected') assert.equal(result.code, 'idempotencyCollision');
});

test('ledger replay of applied becomes noop', () => {
  const hash = hashCommandInput({ title: 'a' });
  const result = replayLedgerResult(
    { inputHash: hash, result: { status: 'applied', resource: { uri: 'tn://growth/todos/1', revision: '1' }, output: { id: '1' } } },
    hash,
  );
  assert.equal(result.status, 'noop');
  if (result.status === 'noop') assert.equal(result.reason, 'idempotentReplay');
});

test('workspace adopt key is stable per workspace and command', () => {
  assert.equal(
    workspaceAdoptKey('ws-1', 'growth', 'createTodo'),
    'workspace:ws-1:growth.createTodo',
  );
  assert.notEqual(
    workspaceAdoptKey('ws-1', 'growth', 'createTodo'),
    workspaceAdoptKey('ws-2', 'growth', 'createTodo'),
  );
});

test('host replays frozen applied/noop and retries failed attempts', () => {
  const hash = hashCommandInput({ title: '滤芯' });
  const applied = decideHostAttemptReplay(
    {
      inputHash: hash,
      status: 'completed',
      result: { status: 'applied', resource: { uri: 'tn://growth/todos/1', revision: '1' } },
    },
    hash,
  );
  assert.equal(applied.action, 'replay');
  if (applied.action === 'replay') {
    assert.equal(applied.result.status, 'noop');
    if (applied.result.status === 'noop') assert.equal(applied.result.resource?.uri, 'tn://growth/todos/1');
  }

  const collision = decideHostAttemptReplay(
    {
      inputHash: hash,
      status: 'completed',
      result: { status: 'applied', resource: { uri: 'tn://growth/todos/1', revision: '1' } },
    },
    hashCommandInput({ title: '米' }),
  );
  assert.equal(collision.action, 'collision');

  const retryUnavailable = decideHostAttemptReplay(
    { inputHash: hash, status: 'completed', result: { status: 'unavailable', reason: 'pluginDisabled' } },
    hashCommandInput({ title: '米' }),
  );
  assert.equal(retryUnavailable.action, 'retry');

  const retryRejected = decideHostAttemptReplay(
    { inputHash: hash, status: 'completed', result: { status: 'rejected', code: 'validation', reason: 'missing title' } },
    hash,
  );
  assert.equal(retryRejected.action, 'retry');
});
