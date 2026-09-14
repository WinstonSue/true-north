import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizePathOverride,
  parseLegacySelection,
  parseRuntimeSettings,
} from '../settings-schema.ts';

const known = ['codex', 'claude-code', 'cursor-agent'];

test('migrates legacy selection and hydrates known agents', () => {
  const settings = parseRuntimeSettings(
    { defaultRuntimeId: parseLegacySelection({ runtimeId: 'codex' }) },
    known
  );
  assert.equal(settings.defaultRuntimeId, 'codex');
  assert.equal(settings.agents.codex.enabled, true);
  assert.equal(settings.agents['claude-code'].pathOverride, null);
});

test('keeps enable and absolute path override', () => {
  const settings = parseRuntimeSettings(
    {
      defaultRuntimeId: 'claude-code',
      agents: {
        'claude-code': { enabled: false, pathOverride: '/usr/local/bin/claude' },
      },
    },
    known
  );
  assert.equal(settings.agents['claude-code'].enabled, false);
  assert.equal(settings.agents['claude-code'].pathOverride, '/usr/local/bin/claude');
});

test('rejects relative path overrides', () => {
  const relative = normalizePathOverride('bin/claude');
  assert.equal(relative.ok, false);
  const empty = normalizePathOverride('  ');
  assert.deepEqual(empty, { ok: true, value: null });
});
