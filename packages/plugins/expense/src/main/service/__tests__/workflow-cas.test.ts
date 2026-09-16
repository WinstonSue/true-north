import assert from 'node:assert/strict';
import test from 'node:test';
import { transactionUri } from '../workflow-cas.ts';

test('transaction uri is namespaced to expense', () => {
  assert.equal(transactionUri('tx-1'), 'tn://expense/transactions/tx-1');
});
