import assert from 'node:assert/strict';
import test from 'node:test';
import { extractClaudeDelta } from '../adapters/claude-events.ts';

test('appends only stream_event text deltas', () => {
  let state = { lastText: '' };
  const first = extractClaudeDelta(
    {
      type: 'stream_event',
      session_id: 's1',
      event: { delta: { type: 'text_delta', text: '你好' } },
    },
    state
  );
  assert.equal(first.delta, '你好');
  assert.equal(first.sessionId, 's1');
  state = first.next;

  const complete = extractClaudeDelta(
    {
      type: 'assistant',
      session_id: 's1',
      message: { content: [{ type: 'text', text: '你好世界' }] },
    },
    state
  );
  assert.equal(complete.delta, undefined);
  assert.equal(complete.next.lastText, '你好');
});
