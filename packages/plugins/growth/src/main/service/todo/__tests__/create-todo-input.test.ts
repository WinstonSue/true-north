import assert from 'node:assert/strict';
import test from 'node:test';
import { createTodoVoFromCommandInput } from '../create-todo-input.ts';

test('maps title planned note and plannedTime', () => {
  const vo = createTodoVoFromCommandInput({
    title: '购买高铁票',
    planned: '2026-09-19',
    plannedTime: '10:00',
    note: '顺德方向',
  });
  assert.equal(vo.name, '购买高铁票');
  assert.equal(vo.planDate, '2026-09-19');
  assert.equal(vo.planStartTime, '10:00');
  assert.equal(vo.planEndTime, '10:00');
  assert.equal(vo.description, '顺德方向');
});

test('prefers form field names over suggest aliases', () => {
  const vo = createTodoVoFromCommandInput({
    name: '写周报',
    title: 'ignored',
    planDate: '2026-09-20',
    planned: '2026-01-01',
    description: '本周总结',
    note: 'ignored note',
    planTimeRange: ['14:00', '15:00'],
    importance: 4,
  });
  assert.equal(vo.name, '写周报');
  assert.equal(vo.planDate, '2026-09-20');
  assert.equal(vo.description, '本周总结');
  assert.equal(vo.planStartTime, '14:00');
  assert.equal(vo.planEndTime, '15:00');
  assert.equal(vo.importance, 4);
});

test('defaults plan time to 09:00 when omitted', () => {
  const vo = createTodoVoFromCommandInput({ name: '无时刻' });
  assert.equal(vo.planStartTime, '09:00');
  assert.equal(vo.planEndTime, '09:00');
});
