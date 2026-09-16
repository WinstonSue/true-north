import assert from 'node:assert/strict';
import test from 'node:test';
import { decideCreateItem, decideRecordMovement } from '../workflow-cas.ts';

test('createItem requires a name', () => {
  const missing = decideCreateItem('');
  assert.equal('proceed' in missing, false);
  if (!('proceed' in missing)) assert.equal(missing.status, 'rejected');
});

test('outbound below zero is rejected and adjust proceeds to target', () => {
  const item = { id: 'i1', name: '滤芯', revision: 1 };
  const location = { id: 'l1', name: '厨房' };
  const balance = { id: 'b1', quantity: 1, revision: 1 };

  const rejected = decideRecordMovement(item, location, balance, { type: 'outbound', quantity: 2 });
  assert.equal('proceed' in rejected, false);
  if (!('proceed' in rejected)) {
    assert.equal(rejected.status, 'rejected');
    if (rejected.status === 'rejected') assert.match(rejected.reason, /insufficient/);
  }

  const adjust = decideRecordMovement(item, location, balance, { type: 'adjust', targetQuantity: 4 });
  assert.equal('proceed' in adjust, true);
});

test('stale balance revision is a conflict, not a new write', () => {
  const result = decideRecordMovement(
    { id: 'i1', name: '滤芯', revision: 1 },
    { id: 'l1', name: '厨房' },
    { id: 'b1', quantity: 1, revision: 2 },
    { type: 'inbound', quantity: 1, expectedRevision: '1' },
  );
  assert.equal('proceed' in result, false);
  if (!('proceed' in result)) assert.equal(result.status, 'conflict');
});
