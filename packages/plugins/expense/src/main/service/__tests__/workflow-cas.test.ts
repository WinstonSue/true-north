import assert from 'node:assert/strict';
import test from 'node:test';
import { transactionUri } from '../workflow-cas.ts';

test('transaction uri is namespaced to expense', () => {
  assert.equal(transactionUri('tx-1'), 'tn://expense/transactions/tx-1');
});

test('parseTransactionId reads the entity id', async () => {
  const { parseTransactionId } = await import('../workflow-cas.ts');
  assert.equal(parseTransactionId('tn://expense/transactions/tx-1'), 'tx-1');
  assert.equal(parseTransactionId('tn://growth/todos/1'), null);
});
