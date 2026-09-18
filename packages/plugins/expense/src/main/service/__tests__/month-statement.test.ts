import assert from 'node:assert/strict';
import test from 'node:test';
import { monthStatementBody, monthStatementTitle, statementMonthOf } from '../../month-statement.ts';

test('statement month is current only on the last day, otherwise previous month', () => {
  assert.equal(statementMonthOf(new Date('2026-09-16T08:00:00')), '2026-08');
  assert.equal(statementMonthOf(new Date('2026-09-30T08:00:00')), '2026-09');
  assert.equal(statementMonthOf(new Date('2026-10-01T08:00:00')), '2026-09');
  assert.equal(statementMonthOf(new Date('2026-10-31T08:00:00')), '2026-10');
});

test('month statement copy uses the closed month', () => {
  assert.equal(monthStatementTitle('2026-09'), '2026年9月账单');
  assert.equal(monthStatementBody(12, 34.5), '收入 12.00 · 支出 34.50');
});
