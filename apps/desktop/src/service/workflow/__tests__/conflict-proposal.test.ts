import assert from 'node:assert/strict';
import test from 'node:test';
import {
  evaluateConflictProposal,
  isConflictAllowedToolName,
} from '../ai/conflict-proposal.ts';

const ticket = {
  id: 'ticket-1',
  status: 'open',
  ticketRevision: 3,
  allowedActions: ['retryWithRevision', 'skipEdge'],
  actualRevision: '9',
};

test('ordinary sessions can use write tools; conflict sessions cannot', () => {
  assert.equal(isConflictAllowedToolName('growth.suggestTodo'), false);
  assert.equal(isConflictAllowedToolName('growth.suggestTodo', { readOnly: false }), false);
  assert.equal(isConflictAllowedToolName('growth.searchGoals', { readOnly: true }), true);
  assert.equal(isConflictAllowedToolName('workflow.compose'), false);
  assert.equal(isConflictAllowedToolName('workflow.proposeConflictResolution'), true);
});

test('conflict proposals bind the current ticket and reject stale revisions', () => {
  const valid = {
    ticketId: 'ticket-1',
    ticketRevision: 3,
    resourceRevision: '9',
    action: 'retryWithRevision' as const,
  };
  assert.deepEqual(evaluateConflictProposal(valid, 'ticket-1', ticket), { ok: true });
  assert.equal(evaluateConflictProposal(valid, undefined, ticket).ok, false);
  const other = evaluateConflictProposal(valid, 'other', ticket);
  assert.equal(other.ok, false);
  if (other.ok === false) assert.match(other.reason, /绑定的冲突工单/);
  const drifted = evaluateConflictProposal({ ...valid, ticketRevision: 2 }, 'ticket-1', ticket);
  assert.equal(drifted.ok, false);
  if (drifted.ok === false) assert.equal(drifted.stale, true);
  const resourceDrift = evaluateConflictProposal({ ...valid, resourceRevision: '8' }, 'ticket-1', ticket);
  assert.equal(resourceDrift.ok, false);
  if (resourceDrift.ok === false) assert.equal(resourceDrift.stale, true);
  const denied = evaluateConflictProposal({ ...valid, action: 'cancelPlan' }, 'ticket-1', ticket);
  assert.equal(denied.ok, false);
  if (denied.ok === false) assert.match(denied.reason, /允许范围/);
  const closed = evaluateConflictProposal(valid, 'ticket-1', { ...ticket, status: 'resolved' });
  assert.equal(closed.ok, false);
  if (closed.ok === false) assert.match(closed.reason, /已关闭/);
  const missing = evaluateConflictProposal(valid, 'ticket-1', null);
  assert.equal(missing.ok, false);
  if (missing.ok === false) assert.match(missing.reason, /不存在/);
});
