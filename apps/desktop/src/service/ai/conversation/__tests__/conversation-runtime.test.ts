import assert from 'node:assert/strict';
import test from 'node:test';
import {
  nextRuntimeThreadId,
  runtimeIdForConversation,
  shouldResumeRuntimeThread,
} from '../conversation-runtime.ts';

test('send uses the conversation agent not the app default', () => {
  assert.equal(runtimeIdForConversation('codex', 'cursor-agent'), 'codex');
  assert.equal(runtimeIdForConversation('cursor-agent', 'codex'), 'cursor-agent');
  assert.equal(runtimeIdForConversation(null, 'codex'), 'codex');
  assert.equal(runtimeIdForConversation(undefined, null), 'cursor-agent');
});

test('new conversations use the requested agent or the default', () => {
  assert.equal(runtimeIdForConversation('codex', 'cursor-agent'), 'codex');
  assert.equal(runtimeIdForConversation(undefined, 'claude-code'), 'claude-code');
  assert.equal(runtimeIdForConversation(undefined, null), 'cursor-agent');
});

test('resume only when the same agent still owns the thread', () => {
  assert.equal(shouldResumeRuntimeThread('codex', 'thread-1', 'codex'), true);
  assert.equal(shouldResumeRuntimeThread('codex', 'thread-1', 'cursor-agent'), false);
  assert.equal(shouldResumeRuntimeThread('codex', null, 'codex'), false);
  assert.equal(shouldResumeRuntimeThread('cursor-agent', 'thread-2', 'cursor-agent'), true);
});

test('switching agent clears the previous thread', () => {
  assert.equal(nextRuntimeThreadId('codex', 'cursor-agent', 'thread-1'), null);
  assert.equal(nextRuntimeThreadId('codex', 'codex', 'thread-1'), 'thread-1');
  assert.equal(nextRuntimeThreadId(undefined, 'codex', undefined), null);
});
