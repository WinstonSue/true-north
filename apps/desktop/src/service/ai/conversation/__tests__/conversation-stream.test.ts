import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeStreamIdForConversation,
  claimConversationStream,
  conversationIdForStream,
  releaseConversationStream,
} from '../conversation-stream.ts';

test('rejects a second stream on the same conversation and allows others', () => {
  assert.deepEqual(claimConversationStream('a', 'stream-a'), { ok: true });
  assert.equal(activeStreamIdForConversation('a'), 'stream-a');
  const second = claimConversationStream('a', 'stream-a-2');
  assert.equal(second.ok, false);
  if (second.ok === false) assert.match(second.message, /正在生成/);

  assert.deepEqual(claimConversationStream('b', 'stream-b'), { ok: true });
  assert.equal(activeStreamIdForConversation('b'), 'stream-b');

  releaseConversationStream('stream-a');
  assert.equal(activeStreamIdForConversation('a'), undefined);
  assert.equal(activeStreamIdForConversation('b'), 'stream-b');
  assert.deepEqual(claimConversationStream('a', 'stream-a-3'), { ok: true });
  assert.equal(activeStreamIdForConversation('a'), 'stream-a-3');
  assert.equal(conversationIdForStream('stream-a-3'), 'a');
  assert.equal(conversationIdForStream('stream-b'), 'b');

  releaseConversationStream('stream-a-3');
  releaseConversationStream('stream-b');
  assert.equal(conversationIdForStream('stream-a-3'), undefined);
});
