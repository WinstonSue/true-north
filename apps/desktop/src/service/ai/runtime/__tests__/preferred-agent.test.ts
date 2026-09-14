import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePreferredAgent } from '../preferred-agent.ts';
import type { RuntimeProbeResult } from '../types.ts';

function probe(partial: Partial<RuntimeProbeResult> & Pick<RuntimeProbeResult, 'id'>): RuntimeProbeResult {
  return {
    name: partial.id,
    enabled: true,
    available: false,
    authenticated: false,
    ...partial,
  };
}

test('uses saved available agent', () => {
  const selected = resolvePreferredAgent(
    [
      probe({ id: 'codex', available: true, authenticated: true }),
      probe({ id: 'claude-code', available: true, authenticated: true }),
    ],
    'claude-code'
  );
  assert.equal(selected?.id, 'claude-code');
});

test('falls back to first available when default is disabled', () => {
  const selected = resolvePreferredAgent(
    [
      probe({ id: 'codex', enabled: false, available: false }),
      probe({ id: 'claude-code', available: true, authenticated: true }),
    ],
    'codex'
  );
  assert.equal(selected?.id, 'claude-code');
});

test('prefers cursor-agent when no saved id', () => {
  const selected = resolvePreferredAgent(
    [
      probe({ id: 'codex', available: true, authenticated: true }),
      probe({ id: 'claude-code', available: true, authenticated: true }),
      probe({ id: 'cursor-agent', available: true, authenticated: true }),
    ],
    null
  );
  assert.equal(selected?.id, 'cursor-agent');
});

test('falls back from cursor-agent when it is unavailable and nothing is saved', () => {
  const selected = resolvePreferredAgent(
    [
      probe({ id: 'codex', available: true, authenticated: true }),
      probe({ id: 'cursor-agent', available: false }),
    ],
    null
  );
  assert.equal(selected?.id, 'codex');
});

test('keeps saved probe when nothing is available', () => {
  const selected = resolvePreferredAgent(
    [probe({ id: 'codex', unavailableReason: '未登录' })],
    'codex'
  );
  assert.equal(selected?.id, 'codex');
});
