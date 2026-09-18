import assert from 'node:assert/strict';
import test from 'node:test';
import {
  emptyWorkflowGraph,
  topologicalNodeKeys,
  validateDefinitionGraph,
  validatePublishedGraph,
  workflowDefinitionGraphSchema,
  type WorkflowDefinitionGraph,
  type WorkflowPrimitiveCatalog,
} from '../src/index.ts';

function graph(partial: Partial<WorkflowDefinitionGraph>): WorkflowDefinitionGraph {
  return {
    ...emptyWorkflowGraph(),
    start: { eventContributionId: 'growth.todoCompleted' },
    rollbackPolicy: 'confirmThenCompensate',
    ...partial,
  };
}

const catalog: WorkflowPrimitiveCatalog = {
  events: new Set(['growth.todoCompleted']),
  commands: new Map([
    ['expense.createTransaction', { compensate: 'deleteTransaction' }],
    ['expense.deleteTransaction', {}],
  ]),
  interactions: new Set(['expense.confirmExpense']),
  workspaces: new Set(['expense.suggestTransaction']),
};

test('draft save allows an empty graph', () => {
  assert.deepEqual(validateDefinitionGraph(emptyWorkflowGraph()), []);
  assert.equal(validatePublishedGraph(emptyWorkflowGraph(), catalog).some((issue) => issue.code === 'empty-graph'), true);
});

test('rejects duplicate node keys and unknown endpoints', () => {
  const issues = validateDefinitionGraph(
    graph({
      nodes: [
        { key: 'a', kind: 'command', contributionId: 'expense.createTransaction' },
        { key: 'a', kind: 'workspace', contributionId: 'expense.suggestTransaction' },
      ],
      edges: [{ key: 'e1', from: 'missing', to: 'a' }],
    }),
  );
  assert.equal(issues.some((issue) => issue.code === 'duplicate-node'), true);
  assert.equal(issues.some((issue) => issue.code === 'unknown-endpoint'), true);
});

test('rejects cycles including start', () => {
  const issues = validateDefinitionGraph(
    graph({
      nodes: [
        { key: 'a', kind: 'command', contributionId: 'expense.createTransaction' },
        { key: 'b', kind: 'command', contributionId: 'expense.deleteTransaction' },
      ],
      edges: [
        { key: 'e1', from: 'a', to: 'b' },
        { key: 'e2', from: 'b', to: 'a' },
      ],
    }),
  );
  assert.equal(issues.some((issue) => issue.code === 'cycle'), true);
});

test('publish requires start event, known primitives, and compensate', () => {
  const missing = validatePublishedGraph(
    graph({
      start: { eventContributionId: 'unknown.event' },
      nodes: [{ key: 'create', kind: 'command', contributionId: 'missing.create' }],
      edges: [{ key: 'e1', from: 'start', to: 'create' }],
    }),
    catalog,
  );
  assert.equal(missing.some((issue) => issue.code === 'unknown-start-event'), true);
  assert.equal(missing.some((issue) => issue.code === 'unknown-contribution'), true);

  const noCompensate = validatePublishedGraph(
    graph({
      nodes: [{ key: 'delete', kind: 'command', contributionId: 'expense.deleteTransaction' }],
      edges: [{ key: 'e1', from: 'start', to: 'delete' }],
    }),
    catalog,
  );
  assert.equal(noCompensate.some((issue) => issue.code === 'missing-compensate'), true);
});

test('valid todo-complete-expense graph publishes and reverse-topo starts at the command', () => {
  const published = graph({
    nodes: [
      { key: 'confirm', kind: 'workspace', contributionId: 'expense.suggestTransaction' },
      { key: 'create', kind: 'command', contributionId: 'expense.createTransaction' },
    ],
    edges: [
      { key: 'e1', from: 'start', to: 'confirm' },
      { key: 'e2', from: 'confirm', to: 'create' },
    ],
    bindings: [
      { from: 'event.payload.title', to: 'confirm.input.title' },
      { from: 'confirm.output', to: 'create.input' },
    ],
  });
  assert.deepEqual(validatePublishedGraph(published, catalog), []);
  assert.deepEqual(topologicalNodeKeys(published), ['confirm', 'create']);
  const parsed = workflowDefinitionGraphSchema.parse(published);
  assert.equal(parsed.schemaVersion, 1);
});
