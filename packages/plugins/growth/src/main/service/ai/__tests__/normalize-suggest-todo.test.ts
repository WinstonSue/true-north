import assert from 'node:assert/strict';
import test from 'node:test';
import {
  extractSpokenPlanTime,
  normalizeSuggestTodoPayload,
} from '../../../../shared/normalize-suggest-todo.ts';

const NOW = new Date(2026, 8, 17, 12, 0, 0);

test('extracts 上午10点 as 10:00', () => {
  assert.equal(extractSpokenPlanTime('9月19日上午10点提醒我购买珠海到顺德的高铁票'), '10:00');
  assert.equal(extractSpokenPlanTime('上午10点提醒'), '10:00');
  assert.equal(extractSpokenPlanTime('十点半'), '10:30');
  assert.equal(extractSpokenPlanTime('下午3点'), '15:00');
  assert.equal(extractSpokenPlanTime('晚上8点'), '20:00');
  assert.equal(extractSpokenPlanTime('中午12点'), '12:00');
  assert.equal(extractSpokenPlanTime('凌晨1点'), '01:00');
  assert.equal(extractSpokenPlanTime('10:00'), '10:00');
});

test('fills plannedTime from note and drops redundant description', () => {
  const payload = normalizeSuggestTodoPayload(
    {
      title: '购买珠海到顺德的高铁票',
      planned: '2026-09-19',
      note: '上午10点提醒',
    },
    NOW,
  );
  assert.equal(payload.title, '购买珠海到顺德的高铁票');
  assert.equal(payload.planned, '2026-09-19');
  assert.equal(payload.plannedTime, '10:00');
  assert.equal(payload.note, undefined);
});

test('spoken time wins over default-looking plannedTime', () => {
  const payload = normalizeSuggestTodoPayload({
    title: '购买珠海到顺德的高铁票',
    plannedTime: '09:00',
    note: '上午10点提醒',
  });
  assert.equal(payload.plannedTime, '10:00');
  assert.equal(payload.note, undefined);
});

test('keeps extra context that is not in the title', () => {
  const payload = normalizeSuggestTodoPayload({
    title: '购买珠海到顺德的高铁票',
    plannedTime: '10:00',
    note: '买二等座',
  });
  assert.equal(payload.plannedTime, '10:00');
  assert.equal(payload.note, '买二等座');
});

test('omits note when it restates the title', () => {
  const payload = normalizeSuggestTodoPayload({
    title: '购买珠海到顺德的高铁票',
    note: '购买珠海到顺德的高铁票',
  });
  assert.equal(payload.note, undefined);
});

test('yearless 9月19日 uses current year when that day has not passed', () => {
  const payload = normalizeSuggestTodoPayload(
    {
      title: '购买珠海到顺德的高铁票',
      planned: '2025-09-19',
      note: '上午10点提醒',
    },
    NOW,
  );
  assert.equal(payload.planned, '2026-09-19');
  assert.equal(payload.plannedTime, '10:00');
});

test('spoken 9月19日 in the title wins over a stale planned year', () => {
  const payload = normalizeSuggestTodoPayload(
    {
      title: '9月19日购买珠海到顺德的高铁票',
      planned: '2025-09-19',
    },
    NOW,
  );
  assert.equal(payload.planned, '2026-09-19');
});

test('explicit 2025年9月19日 keeps 2025', () => {
  const payload = normalizeSuggestTodoPayload(
    {
      title: '购买珠海到顺德的高铁票',
      planned: '2025-09-19',
      note: '2025年9月19日',
    },
    NOW,
  );
  assert.equal(payload.planned, '2025-09-19');
});

test('yearless date that already passed this year rolls to next year', () => {
  const payload = normalizeSuggestTodoPayload(
    {
      title: '买票',
      planned: '2025-09-10',
    },
    NOW,
  );
  assert.equal(payload.planned, '2027-09-10');
});
