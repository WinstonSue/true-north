import assert from 'node:assert/strict';
import test from 'node:test';
import { boundInputFor } from '../bindings.ts';
import { reverseCommandKeys } from '../instance-graph.ts';
import { composeInputFromGraph, graphFromCompose } from '../compose-schema.ts';
import { emptyWorkflowGraph } from '@true-north/plugin-contract';

test('bindings copy event payload into a workspace input', () => {
  const input = boundInputFor(
    'confirm',
    [
      { from: 'event.payload.title', to: 'confirm.input.title' },
      { from: 'event.payload.occurredAt', to: 'confirm.input.occurredAt' },
    ],
    { event: { payload: { title: '买高铁票', occurredAt: '2026-09-17' } }, nodes: {} },
  );
  assert.equal(input.title, '买高铁票');
  assert.equal(input.occurredAt, '2026-09-17');
});

test('reverse compensation order is command nodes from sink to source', () => {
  const graph = {
    ...emptyWorkflowGraph(),
    start: { eventContributionId: 'growth.todoCompleted' },
    nodes: [
      { key: 'confirm', kind: 'workspace' as const, contributionId: 'expense.suggestTransaction' },
      { key: 'create', kind: 'command' as const, contributionId: 'expense.createTransaction' },
    ],
    edges: [
      { key: 'e1', from: 'start', to: 'confirm' },
      { key: 'e2', from: 'confirm', to: 'create' },
    ],
  };
  assert.deepEqual(reverseCommandKeys(graph), ['create']);
});

test('compose projection round-trips command nodes', () => {
  const graph = {
    ...emptyWorkflowGraph(),
    nodes: [{ key: 'create', kind: 'command' as const, contributionId: 'expense.createTransaction' }],
    edges: [{ key: 'e1', from: 'start', to: 'create' }],
  };
  const compose = composeInputFromGraph(graph);
  assert.equal(compose.nodes[0]?.commandId, 'expense.createTransaction');
  const back = graphFromCompose(compose, 'growth.todoCompleted');
  assert.equal(back.nodes[0]?.contributionId, 'expense.createTransaction');
});

test('instance uniqueness key is association plus event', () => {
  const first = { associationId: 'a1', triggerEventId: 'e1' };
  const again = { associationId: 'a1', triggerEventId: 'e1' };
  const nextComplete = { associationId: 'a1', triggerEventId: 'e2' };
  assert.equal(`${first.associationId}:${first.triggerEventId}`, `${again.associationId}:${again.triggerEventId}`);
  assert.notEqual(`${first.associationId}:${first.triggerEventId}`, `${nextComplete.associationId}:${nextComplete.triggerEventId}`);
});

test('duplicate template imports keep the oldest row', async () => {
  const { extrasAfterOldestByKey } = await import('../migrations.ts');
  const extras = extrasAfterOldestByKey(
    [
      { id: 'a', sourceTemplateKey: 'expense.todo', createdAt: new Date('2026-01-02') },
      { id: 'b', sourceTemplateKey: 'expense.todo', createdAt: new Date('2026-01-01') },
      { id: 'c', sourceTemplateKey: 'other', createdAt: new Date('2026-01-03') },
    ],
    (row) => row.sourceTemplateKey,
    (row) => row.createdAt,
  );
  assert.deepEqual(extras.map((row) => row.id), ['a']);
});
