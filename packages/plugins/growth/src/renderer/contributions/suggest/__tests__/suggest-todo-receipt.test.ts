import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createdTodoIdFromPayload,
  createdTodoIdFromResult,
  receiptFormFromPayload,
} from '../suggest-todo-receipt.ts';

test('old adopted payload still fills name date and spoken time', () => {
  const form = receiptFormFromPayload({
    adopted: true,
    title: '买米',
    planned: '2026-09-19',
    note: '上午10点提醒',
  });
  assert.equal(form.name, '买米');
  assert.equal(form.planDate, '2026-09-19');
  assert.deepEqual(form.planTimeRange, ['10:00', '10:00']);
});

test('submitted snapshot wins over original suggestion fields', () => {
  const form = receiptFormFromPayload({
    adopted: true,
    title: '买米',
    name: '买两袋米',
    planned: '2026-09-19',
    planDate: '2026-09-20',
    plannedTime: '09:00',
    planStartTime: '14:00',
    planEndTime: '15:00',
    note: '原来的备注',
    description: '确认后的描述',
    importance: 3,
    urgency: 4,
    workflowDefinitionId: 'def-1',
  });
  assert.equal(form.name, '买两袋米');
  assert.equal(form.planDate, '2026-09-20');
  assert.deepEqual(form.planTimeRange, ['14:00', '15:00']);
  assert.equal(form.description, '确认后的描述');
  assert.equal(form.importance, 3);
  assert.equal(form.urgency, 4);
  assert.equal(form.workflowDefinitionId, 'def-1');
});

test('parses created todo id from resource uri', () => {
  assert.equal(
    createdTodoIdFromPayload({ resource: { uri: 'tn://growth/todos/todo-1' } }),
    'todo-1',
  );
  assert.equal(createdTodoIdFromPayload({ resource: { uri: 'tn://expense/tx/1' } }), '');
  assert.equal(
    createdTodoIdFromResult({
      status: 'applied',
      output: { id: 'from-output' },
      resource: { uri: 'tn://growth/todos/from-uri', revision: '1' },
    }),
    'from-output',
  );
  assert.equal(
    createdTodoIdFromResult({
      status: 'noop',
      reason: 'alreadyApplied',
      resource: { uri: 'tn://growth/todos/from-uri', revision: '1' },
    }),
    'from-uri',
  );
});
