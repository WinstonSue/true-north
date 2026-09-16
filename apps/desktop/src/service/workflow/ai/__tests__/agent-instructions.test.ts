import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const instructions = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../index.ts'), 'utf8');

test('ticket reminders stay on todo and never enter inventory', () => {
  assert.match(instructions, /9月17日提醒我购买汕头到深圳的高铁票/);
  assert.match(instructions, /只生成待办/);
  assert.match(instructions, /高铁票、机票、酒店、服务、预约、缴费、订阅和数字权益永不进入物资/);
  assert.match(instructions, /growth\.suggestTodo/);
  assert.doesNotMatch(instructions, /purchase\.suggestPurchase/);
});

test('buy reminders are todos unless stock is explicitly requested', () => {
  assert.match(instructions, /提醒我买两盒滤芯/);
  assert.match(instructions, /除非用户同时要求记录库存/);
  assert.match(instructions, /家里滤芯剩1个，低于2个要补到4个/);
  assert.match(instructions, /inventory\.suggestItem/);
});

test('inbound with money creates two independent suggestions', () => {
  assert.match(instructions, /刚入库2盒滤芯，花了80元/);
  assert.match(instructions, /独立事实/);
  assert.match(instructions, /每个建议工作台只采纳一次/);
});
