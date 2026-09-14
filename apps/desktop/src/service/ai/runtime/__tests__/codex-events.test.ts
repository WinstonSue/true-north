import assert from 'node:assert/strict';
import test from 'node:test';
import { extractDelta } from '../adapters/codex-events.ts';

test('emits snapshot suffix for completed agent messages', () => {
  const first = extractDelta(
    { type: 'item.completed', item: { type: 'agent_message', text: '你好' } },
    ''
  );
  assert.equal(first.delta, '你好');
  const second = extractDelta(
    { type: 'item.completed', item: { type: 'agent_message', text: '你好世界' } },
    first.nextLastAgentText
  );
  assert.equal(second.delta, '世界');
});

test('ignores reasoning items', () => {
  const result = extractDelta(
    { type: 'item.updated', item: { type: 'reasoning', text: 'think' } },
    ''
  );
  assert.equal(result.delta, undefined);
});
