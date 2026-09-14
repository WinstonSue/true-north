import assert from 'node:assert/strict';
import test from 'node:test';
import { RequestError } from '@agentclientprotocol/sdk';
import {
  cursorHttpMcpServer,
  extractCursorAgentText,
  formatAcpError,
  permissionOptionId,
  shouldAllowCursorPermission,
} from '../adapters/cursor-events.ts';

test('extracts agent message chunks only', () => {
  assert.equal(
    extractCursorAgentText({
      sessionUpdate: 'agent_message_chunk',
      content: { type: 'text', text: 'hello' },
    }),
    'hello'
  );
  assert.equal(
    extractCursorAgentText({
      sessionUpdate: 'user_message_chunk',
      content: { type: 'text', text: 'hello' },
    }),
    undefined
  );
});

test('allows workspace and true_north MCP, rejects others', () => {
  const workspace = '/tmp/ws';
  assert.equal(
    shouldAllowCursorPermission(
      {
        toolCall: {
          title: 'true_north list',
          kind: 'mcp',
          rawInput: { server: 'true_north' },
        },
      },
      workspace
    ),
    true
  );
  assert.equal(
    shouldAllowCursorPermission(
      {
        toolCall: {
          kind: 'edit',
          locations: [{ path: '/tmp/ws/AGENTS.md' }],
        },
      },
      workspace
    ),
    true
  );
  assert.equal(
    shouldAllowCursorPermission(
      {
        toolCall: {
          kind: 'execute',
          rawInput: { path: '/etc/passwd' },
        },
      },
      workspace
    ),
    false
  );
  assert.equal(permissionOptionId([{ optionId: 'allow-once' }], 'allow'), 'allow-once');
});

test('http MCP config includes empty headers', () => {
  const server = cursorHttpMcpServer('http://127.0.0.1:9/mcp');
  assert.equal(server.type, 'http');
  assert.equal(server.name, 'true_north');
  assert.equal(server.url, 'http://127.0.0.1:9/mcp');
  assert.deepEqual(server.headers, []);
});

test('maps structured JSON-RPC internal errors without leaking secrets', () => {
  const mapped = formatAcpError(
    RequestError.internalError({ reason: 'session/new failed' }, 'Internal error')
  );
  assert.match(mapped, /Cursor Agent 会话初始化失败/);
  assert.match(mapped, /session\/new failed/);

  const leaked = formatAcpError(
    new RequestError(-32603, 'Internal error', {
      headers: [{ name: 'Authorization', value: 'Bearer secret-token' }],
    })
  );
  assert.match(leaked, /Cursor Agent 会话初始化失败/);
  assert.doesNotMatch(leaked, /secret-token|Bearer|Authorization/i);
});
