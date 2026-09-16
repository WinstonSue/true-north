import assert from 'node:assert/strict';
import test from 'node:test';
import { applyQuantityDelta, isLowStock, restockQuantity } from '../stock.ts';

test('inbound increases stock and outbound cannot go negative', () => {
  const inbound = applyQuantityDelta(1, 'inbound', 2);
  assert.equal('next' in inbound, true);
  if ('next' in inbound) assert.equal(inbound.next, 3);

  const outbound = applyQuantityDelta(2, 'outbound', 2);
  assert.equal('next' in outbound, true);
  if ('next' in outbound) {
    assert.equal(outbound.next, 0);
    assert.equal(outbound.delta, -2);
  }

  const rejected = applyQuantityDelta(1, 'outbound', 2);
  assert.equal('error' in rejected, true);
  if ('error' in rejected) assert.equal(rejected.error, 'insufficient stock');
});

test('adjust uses the target quantity as the next balance', () => {
  const adjusted = applyQuantityDelta(1, 'adjust', undefined, 4);
  assert.equal('next' in adjusted, true);
  if ('next' in adjusted) {
    assert.equal(adjusted.next, 4);
    assert.equal(adjusted.delta, 3);
  }
});

test('low stock and restock quantity come from min and target', () => {
  assert.equal(isLowStock(1, 2), true);
  assert.equal(isLowStock(2, 2), false);
  assert.equal(restockQuantity(1, 4), 3);
  assert.equal(restockQuantity(4, 4), 0);
});
