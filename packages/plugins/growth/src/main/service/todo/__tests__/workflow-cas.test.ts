import assert from 'node:assert/strict';
import test from 'node:test';
import { decideCompleteTodo } from '../workflow-cas.ts';

test('completeTodo conflicts on stale revision', () => {
  const result = decideCompleteTodo(
    { id: 't1', name: '买米', status: 'todo', revision: 3 },
    { uri: 'tn://growth/todos/t1', expectedRevision: '1' },
  );
  assert.equal('proceed' in result, false);
  if (!('proceed' in result)) assert.equal(result.status, 'conflict');
});

test('completeTodo is noop when already done', () => {
  const result = decideCompleteTodo(
    { id: 't1', name: '买米', status: 'done', revision: 2 },
    { uri: 'tn://growth/todos/t1', expectedRevision: '2' },
  );
  assert.equal('proceed' in result, false);
  if (!('proceed' in result)) assert.equal(result.status, 'noop');
});

test('completeTodo proceeds for a matching pending todo', () => {
  const result = decideCompleteTodo(
    { id: 't1', name: '买米', status: 'todo', revision: 1 },
    { uri: 'tn://growth/todos/t1', expectedRevision: '1' },
  );
  assert.equal('proceed' in result, true);
});
