import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { composeSchema } from '../compose-schema.ts';
import { commandResultSchema } from '@true-north/plugin-contract';

function hashCommandInput(input: unknown): string {
  return createHash('sha256').update(JSON.stringify(input ?? null)).digest('hex');
}

test('compose schema accepts plan shapes', () => {
  const parsed = composeSchema.parse({
    nodes: [
      { workspaceId: 'a', pluginId: 'growth', commandId: 'growth.createTodo' },
      { workspaceId: 'b', pluginId: 'inventory', commandId: 'inventory.createItem' },
    ],
    edges: [{ fromWorkspaceId: 'a', toWorkspaceId: 'b', commands: ['inventory.recordInbound'] }],
  });
  assert.equal(parsed.edges?.[0]?.commands[0], 'inventory.recordInbound');
});

test('command input hash is stable and distinguishes payloads', () => {
  assert.equal(hashCommandInput({ a: 1 }), hashCommandInput({ a: 1 }));
  assert.notEqual(hashCommandInput({ a: 1 }), hashCommandInput({ a: 2 }));
});

test('conflict result is a first-class command result', () => {
  const parsed = commandResultSchema.parse({
    status: 'conflict',
    expectedRevision: '1',
    actualRevision: '2',
    reason: 'revision mismatch',
  });
  assert.equal(parsed.status, 'conflict');
});

test('rejected idempotency collision is not a retryable conflict', () => {
  const parsed = commandResultSchema.parse({
    status: 'rejected',
    code: 'idempotencyCollision',
    reason: 'same host attempt key with different input',
  });
  assert.equal(parsed.status, 'rejected');
  assert.equal(parsed.code, 'idempotencyCollision');
});

test('noop alreadyApplied can advance an edge', () => {
  const parsed = commandResultSchema.parse({
    status: 'noop',
    reason: 'alreadyApplied',
    resource: { uri: 'tn://inventory/items/1', revision: '2' },
  });
  assert.equal(parsed.status, 'noop');
});
