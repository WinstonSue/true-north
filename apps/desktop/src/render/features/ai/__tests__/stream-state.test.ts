import assert from 'node:assert/strict';
import test from 'node:test';
import type { MessageVo } from '@true-north/vo';
import {
  applyDeltaToMessages,
  applyFetchedMessages,
  applyMessageToList,
  enqueuePendingStreamEvent,
  findStreamByConversation,
  findStreamById,
  markStreamSuppressError,
  materializeBeginStream,
  patchConversationMessages,
  removeStream,
  streamingConversationIds,
  upsertStream,
  type StreamRegistry,
} from '../stream-state.ts';

function message(id: string, conversationId: string, text: string): MessageVo {
  return {
    id,
    conversationId,
    role: 'assistant',
    parts: [{ type: 'text', text }],
    createdAt: '2026-09-14T00:00:00.000Z',
  };
}

function stream(
  streamId: string,
  conversationId: string,
  assistantId: string
): Parameters<typeof upsertStream>[1] {
  return {
    streamId,
    conversationId,
    assistantId,
    autoOpenOnDone: false,
    suppressError: false,
  };
}

test('switching conversations does not cancel the original stream', () => {
  let registry: StreamRegistry = upsertStream({}, stream('s-a', 'a', 'asst-a'));
  registry = upsertStream(registry, stream('s-b', 'b', 'asst-b'));
  assert.equal(findStreamByConversation(registry, 'a')?.streamId, 's-a');
  assert.equal(findStreamByConversation(registry, 'b')?.streamId, 's-b');
  assert.deepEqual(streamingConversationIds(registry).sort(), ['a', 'b']);
});

test('same conversation keeps a single stream', () => {
  let registry: StreamRegistry = upsertStream({}, stream('s-a', 'a', 'asst-1'));
  registry = upsertStream(registry, stream('s-a-2', 'a', 'asst-2'));
  assert.equal(findStreamById(registry, 's-a'), undefined);
  assert.equal(findStreamByConversation(registry, 'a')?.streamId, 's-a-2');
});

test('A and B receive deltas independently and returning to A keeps text', () => {
  let cache: Record<string, MessageVo[]> = {
    a: [message('asst-a', 'a', '')],
    b: [message('asst-b', 'b', '')],
  };
  cache = patchConversationMessages(cache, 'a', (msgs) =>
    applyDeltaToMessages(msgs, 'asst-a', '你好')
  );
  cache = patchConversationMessages(cache, 'b', (msgs) =>
    applyDeltaToMessages(msgs, 'asst-b', 'hello')
  );
  cache = patchConversationMessages(cache, 'a', (msgs) =>
    applyDeltaToMessages(msgs, 'asst-a', '世界')
  );
  assert.equal((cache.a[0].parts[0] as { text: string }).text, '你好世界');
  assert.equal((cache.b[0].parts[0] as { text: string }).text, 'hello');
});

test('stopping or deleting A only removes A', () => {
  let registry: StreamRegistry = upsertStream({}, stream('s-a', 'a', 'asst-a'));
  registry = upsertStream(registry, stream('s-b', 'b', 'asst-b'));
  registry = markStreamSuppressError(registry, 's-a');
  registry = removeStream(registry, 's-a');
  assert.equal(findStreamByConversation(registry, 'a'), undefined);
  assert.equal(findStreamByConversation(registry, 'b')?.streamId, 's-b');
});

test('background done or error does not rewrite another conversation', () => {
  let cache: Record<string, MessageVo[]> = {
    a: [message('asst-a', 'a', '草稿')],
    b: [message('asst-b', 'b', '当前')],
  };
  let registry: StreamRegistry = upsertStream({}, stream('s-a', 'a', 'asst-a'));
  registry = upsertStream(registry, stream('s-b', 'b', 'asst-b'));
  cache = patchConversationMessages(cache, 'a', (msgs) =>
    applyMessageToList(msgs, message('asst-a', 'a', '完成'))
  );
  registry = removeStream(registry, 's-a');
  assert.equal((cache.b[0].parts[0] as { text: string }).text, '当前');
  assert.equal(findStreamByConversation(registry, 'b')?.streamId, 's-b');
  assert.equal(findStreamByConversation(registry, 'a'), undefined);
});

test('replays delta, done, and error that arrived before beginStream', () => {
  const user = {
    ...message('user-a', 'a', '你好'),
    role: 'user' as const,
  };
  const assistant = message('asst-a', 'a', '');
  let pending = enqueuePendingStreamEvent({}, { streamId: 's-a', event: 'delta', delta: '早到' });
  pending = enqueuePendingStreamEvent(pending, {
    streamId: 's-a',
    event: 'done',
    message: message('asst-a', 'a', '早到完成'),
  });
  pending = enqueuePendingStreamEvent(pending, {
    streamId: 's-b',
    event: 'delta',
    delta: 'B的字',
  });

  const started = materializeBeginStream({
    cache: {},
    registry: {},
    pending,
    conversationId: 'a',
    streamId: 's-a',
    user,
    assistant,
  });

  assert.equal(
    (started.cache.a.find((item) => item.id === 'asst-a')?.parts[0] as { text: string }).text,
    '早到完成'
  );
  assert.equal(findStreamById(started.registry, 's-a'), undefined);
  assert.equal(started.terminal?.event, 'done');
  assert.equal(started.pending['s-b']?.events.length, 1);

  const startedB = materializeBeginStream({
    cache: { b: [message('asst-b', 'b', '')] },
    registry: started.registry,
    pending: started.pending,
    conversationId: 'b',
    streamId: 's-b',
    user: { ...message('user-b', 'b', 'hi'), role: 'user' },
    assistant: message('asst-b', 'b', ''),
  });
  assert.equal(
    (startedB.cache.b.find((item) => item.id === 'asst-b')?.parts[0] as { text: string }).text,
    'B的字'
  );
  assert.equal(findStreamByConversation(startedB.registry, 'b')?.streamId, 's-b');
});

test('late listMessages snapshot does not wipe streaming text', () => {
  const local = [message('asst-a', 'a', '草稿已出')];
  const stale = [message('asst-a', 'a', '')];
  const streaming = applyFetchedMessages({ a: local }, 'a', stale, true);
  assert.equal((streaming.a[0].parts[0] as { text: string }).text, '草稿已出');

  const idle = applyFetchedMessages({ a: local }, 'a', stale, false);
  assert.equal((idle.a[0].parts[0] as { text: string }).text, '');
});

test('early error still materializes after placeholders exist', () => {
  const started = materializeBeginStream({
    cache: {},
    registry: {},
    pending: enqueuePendingStreamEvent(
      {},
      { streamId: 's-err', event: 'error', code: 'INTERNAL', messageText: '生成失败：超时' }
    ),
    conversationId: 'err',
    streamId: 's-err',
    user: { ...message('user-err', 'err', '你好'), role: 'user' },
    assistant: message('asst-err', 'err', ''),
  });
  assert.equal(started.terminal?.event, 'error');
  assert.equal(findStreamById(started.registry, 's-err'), undefined);
  assert.equal(
    (started.cache.err.find((item) => item.id === 'asst-err')?.parts[0] as { text: string }).text,
    ''
  );
});
