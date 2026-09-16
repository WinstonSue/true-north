import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../ai.ts'), 'utf8');

test('inventory tools exclude tickets, services and buy reminders', () => {
  assert.match(src, /可储存、可计量、可定位/);
  assert.match(src, /票务、服务、预约、订阅、数字权益/);
  assert.match(src, /提醒我购买/);
  assert.match(src, /9月17日提醒我购买汕头到深圳的高铁票/);
  assert.match(src, /提醒我买两盒滤芯/);
  assert.match(src, /家里滤芯剩1个，低于2个要补到4个/);
  assert.match(src, /刚入库2盒滤芯，花了80元/);
  assert.match(src, /入库、出库或盘点/);
  assert.match(src, /金额走记账/);
});
