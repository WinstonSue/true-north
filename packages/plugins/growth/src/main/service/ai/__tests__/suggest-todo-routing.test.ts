import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../suggest-todo.tool.ts'), 'utf8');

test('ticket and buy reminders stay on suggest todo', () => {
  assert.match(src, /9月17日提醒我购买汕头到深圳的高铁票/);
  assert.match(src, /只生成待办/);
  assert.match(src, /提醒我买两盒滤芯/);
  assert.match(src, /除非用户同时要求记录库存/);
  assert.match(src, /高铁票、机票、酒店、服务、预约、缴费、订阅和数字权益永不进入物资/);
  assert.match(src, /plannedTime/);
  assert.match(src, /normalizeSuggestTodoPayload/);
  assert.match(src, /系统提供的当前日期/);
  assert.doesNotMatch(src, /purchase\.suggestPurchase/);
});
