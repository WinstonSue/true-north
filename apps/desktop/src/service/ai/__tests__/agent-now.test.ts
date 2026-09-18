import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { agentClockBlock, formatAgentNow, withAgentClockPrefix } from '../agent-now.ts';

const now = new Date(2026, 8, 17, 11, 59, 0);

test('formatAgentNow writes local date and time', () => {
  assert.equal(formatAgentNow(now), '当前时间：2026-09-17 11:59（本地）');
});

test('agentClockBlock forbids training-cutoff years', () => {
  const block = agentClockBlock(now);
  assert.match(block, /2026-09-17 11:59/);
  assert.match(block, /不要用训练数据里的年份/);
});

test('withAgentClockPrefix keeps the user text after the clock', () => {
  assert.equal(
    withAgentClockPrefix('9月19日提醒我买票', now),
    `${agentClockBlock(now)}\n\n9月19日提醒我买票`,
  );
});

test('workspace AGENTS.md and conversation prompt both inject the clock', () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const workspace = readFileSync(join(root, '../runtime/workspace.ts'), 'utf8');
  const conversation = readFileSync(join(root, '../conversation/conversation.service.ts'), 'utf8');
  assert.match(workspace, /agentClockBlock/);
  assert.match(conversation, /withAgentClockPrefix/);
});
