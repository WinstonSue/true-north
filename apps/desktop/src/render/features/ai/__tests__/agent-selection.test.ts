import assert from 'node:assert/strict';
import test from 'node:test';
import type { RuntimeAgentVo } from '@true-north/vo';
import { resolveAgentId } from '../agent-selection.ts';

function agent(id: string, available = true): RuntimeAgentVo {
  return { id, name: id, available, authenticated: available };
}

test('blank draft prefers cursor-agent over earlier registry agents', () => {
  assert.equal(
    resolveAgentId(
      [agent('codex'), agent('claude-code'), agent('cursor-agent')],
      null
    ),
    'cursor-agent'
  );
});

test('open session restores that session agent', () => {
  assert.equal(
    resolveAgentId(
      [agent('codex'), agent('claude-code'), agent('cursor-agent')],
      'codex'
    ),
    'codex'
  );
});

test('falls back to first available when the session agent is unavailable', () => {
  assert.equal(
    resolveAgentId(
      [agent('codex', true), agent('cursor-agent', false)],
      'cursor-agent'
    ),
    'codex'
  );
});
