import assert from 'node:assert/strict';
import test from 'node:test';
import { edgeStatusFor, nextEdgeAfterSuccess, planStatusFor } from '../edge-policy.ts';

test('applied and already-applied noop can advance an edge', () => {
  assert.deepEqual(nextEdgeAfterSuccess(0, 3), { commandCursor: 1, status: 'armed' });
  assert.deepEqual(nextEdgeAfterSuccess(2, 3), { commandCursor: 3, status: 'succeeded' });
});

test('revision conflict and missing resources stop without retry', () => {
  assert.equal(edgeStatusFor({ status: 'conflict', reason: 'revision mismatch' }), 'conflict');
  assert.equal(edgeStatusFor({ status: 'rejected', code: 'precondition', reason: 'cancelled' }), 'conflict');
  assert.equal(edgeStatusFor({ status: 'notFound' }), 'conflict');
});

test('plugin missing is blocked rather than conflict', () => {
  assert.equal(edgeStatusFor({ status: 'unavailable', reason: 'pluginMissing' }), 'blocked_plugin');
  assert.equal(edgeStatusFor({ status: 'unavailable', reason: 'pluginDisabled' }), 'retryable_error');
});

test('expense success then inventory conflict marks the plan partial', () => {
  assert.equal(planStatusFor([{ status: 'succeeded' }, { status: 'conflict' }]), 'partial');
  assert.equal(planStatusFor([{ status: 'succeeded' }, { status: 'succeeded' }]), 'completed');
});
