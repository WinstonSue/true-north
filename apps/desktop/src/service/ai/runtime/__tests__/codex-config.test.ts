import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCodexSessionConfig,
  CODEX_IDLE_TIMEOUT_MS,
  resolveCodexIdleTimeoutMs,
} from '../codex-config.ts';

const dirty = `
model = "gpt-5"
review_model = "gpt-5"
model_reasoning_effort = "xhigh"
notify = "osascript"
disable_response_storage = true

[plugins."marketplaces"]
enabled = true

[mcp_servers.node_repl]
command = "node"
args = ["repl.js"]
startup_timeout_sec = 120

[mcp_servers.computer_use]
command = "computer-use"

[mcp_servers.true_north]
url = "http://127.0.0.1:9/old"

[model_providers.openai]
base_url = "https://example.invalid/v1"

[projects."/Users/me/code"]
trust_level = "trusted"

[features]
js_repl = true
[desktop]
enabled = true
`;

test('session config keeps model connection fields and True North MCP only', () => {
  const next = buildCodexSessionConfig(dirty, 'http://127.0.0.1:3210/mcp');
  assert.match(next, /model = "gpt-5"/);
  assert.match(next, /\[model_providers\.openai\]/);
  assert.match(next, /base_url = "https:\/\/example\.invalid\/v1"/);
  assert.match(next, /\[mcp_servers\.true_north\]/);
  assert.match(next, /url = "http:\/\/127\.0\.0\.1:3210\/mcp"/);
  assert.doesNotMatch(next, /model_reasoning_effort/);
  assert.doesNotMatch(next, /notify/);
  assert.doesNotMatch(next, /node_repl/);
  assert.doesNotMatch(next, /computer_use/);
  assert.doesNotMatch(next, /plugins/);
  assert.doesNotMatch(next, /projects\./);
  assert.doesNotMatch(next, /\[features\]/);
  assert.doesNotMatch(next, /\[desktop\]/);
  assert.doesNotMatch(next, /127\.0\.0\.1:9\/old/);
});

test('empty user config still writes True North MCP', () => {
  const next = buildCodexSessionConfig('', 'http://127.0.0.1:1/mcp');
  assert.equal(
    next.trim(),
    '[mcp_servers.true_north]\nurl = "http://127.0.0.1:1/mcp"\ndefault_tools_approval_mode = "approve"'
  );
});

test('idle timeout falls back to the default', () => {
  assert.equal(resolveCodexIdleTimeoutMs({}), CODEX_IDLE_TIMEOUT_MS);
  assert.equal(resolveCodexIdleTimeoutMs({ TN_CODEX_IDLE_TIMEOUT_MS: '1500' }), 1500);
  assert.equal(resolveCodexIdleTimeoutMs({ TN_CODEX_IDLE_TIMEOUT_MS: 'nope' }), CODEX_IDLE_TIMEOUT_MS);
});
