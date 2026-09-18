import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveRequestedConversation } from '../session-route.ts';

test('no requested id opens a blank conversation', () => {
  assert.deepEqual(
    resolveRequestedConversation({
      requestedId: null,
      conversationIds: ['a'],
      loaded: true,
    }),
    { action: 'blank' }
  );
});

test('known id stays open', () => {
  assert.deepEqual(
    resolveRequestedConversation({
      requestedId: 'a',
      conversationIds: ['a', 'b'],
      loaded: true,
    }),
    { action: 'open', id: 'a' }
  );
});

test('unknown id waits until the list has loaded', () => {
  assert.deepEqual(
    resolveRequestedConversation({
      requestedId: 'gone',
      conversationIds: [],
      loaded: false,
    }),
    { action: 'pending', id: 'gone' }
  );
});

test('deleted or unknown id opens a blank conversation after the list loads', () => {
  assert.deepEqual(
    resolveRequestedConversation({
      requestedId: 'gone',
      conversationIds: ['a'],
      loaded: true,
    }),
    { action: 'blank' }
  );
});
