import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bindStreamToCurrentTrace,
  clearDevTrace,
  recordAiStreamEvent,
  runRestTrace,
  snapshotDevTrace,
  traceExternal,
} from '../collector.ts';

function enableTrace() {
  process.env.NODE_ENV = 'development';
  delete process.env.TN_DEV_PROFILE;
  clearDevTrace();
}

function dump(entries = snapshotDevTrace()): string {
  return JSON.stringify(entries);
}

test('binds stream early, coalesces deltas, and closes on done without logging bodies', async () => {
  enableTrace();
  const result = await runRestTrace(
    {
      method: 'POST',
      path: '/ai/conversations/cid/messages/stream',
      payload: { text: '你好世界', entityLinks: [{ type: 'goal', id: 'g1' }] },
    },
    async () => {
      bindStreamToCurrentTrace('sid', 'cid');
      return {
        code: 200,
        data: {
          streamId: 'sid',
          user: { id: 'u1', parts: [{ type: 'text', text: '你好世界' }] },
          assistant: { id: 'a1', parts: [{ type: 'text', text: '模型回复正文' }] },
        },
      };
    }
  );
  assert.equal(result.code, 200);

  await traceExternal({ kind: 'spawn', streamId: 'sid', summary: 'codex exec' }, async () => 'ok');
  const afterSpawn = snapshotDevTrace();
  assert.equal(afterSpawn.length, 1);
  assert.equal(afterSpawn[0].open, true);
  assert.equal(afterSpawn[0].conversationId, 'cid');
  assert.ok(afterSpawn[0].spans.some((span) => span.kind === 'spawn'));

  recordAiStreamEvent({ streamId: 'sid', event: 'delta', chars: 2 });
  recordAiStreamEvent({ streamId: 'sid', event: 'delta', chars: 5 });
  recordAiStreamEvent({
    streamId: 'sid',
    event: 'message',
    partKinds: ['text', 'tool'],
  });
  recordAiStreamEvent({ streamId: 'sid', event: 'done' });

  const [entry] = snapshotDevTrace();
  assert.equal(entry.open, false);
  assert.deepEqual(entry.params, { textChars: 4, entityCount: 1 });
  assert.equal((entry.response as { streamId?: string }).streamId, 'sid');
  const summaries = entry.spans.map((span) => span.summary);
  assert.ok(summaries.includes('开始生成'));
  assert.ok(summaries.some((summary) => summary.includes('输出 2 次') && summary.includes('7 字')));
  assert.ok(summaries.includes('工具调用 1 次'));
  assert.ok(summaries.includes('已完成'));
  const json = dump();
  assert.doesNotMatch(json, /你好世界/);
  assert.doesNotMatch(json, /模型回复正文/);
});

test('error closes the request with a safe code and spawn does not leak prompt', async () => {
  enableTrace();
  await runRestTrace(
    { method: 'POST', path: '/ai/conversations/cid/messages/stream', payload: { text: '密钥PROMPT' } },
    async () => {
      bindStreamToCurrentTrace('sid-2', 'cid-2');
      return { code: 200, data: { streamId: 'sid-2' } };
    }
  );
  await traceExternal(
    { kind: 'spawn', streamId: 'sid-2', summary: 'codex exec', detail: { bin: 'codex' } },
    async () => 'ok'
  );
  recordAiStreamEvent({ streamId: 'sid-2', event: 'error', code: 'TIMEOUT' });
  const [entry] = snapshotDevTrace();
  assert.equal(entry.open, false);
  assert.equal(entry.ok, false);
  assert.equal(entry.error, 'TIMEOUT');
  assert.ok(entry.spans.some((span) => span.summary === '失败' && span.error === 'TIMEOUT'));
  assert.doesNotMatch(dump(), /密钥PROMPT/);
});
