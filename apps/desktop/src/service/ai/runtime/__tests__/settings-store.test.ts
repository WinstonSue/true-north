import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readRuntimeId, readRuntimeSettings, setRuntimeDataDir, writeRuntimeId } from '../settings-store.ts';

test('migrates legacy selection file into settings', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tn-runtime-'));
  setRuntimeDataDir(dir);
  fs.writeFileSync(
    path.join(dir, 'ai-runtime-selection.json'),
    `${JSON.stringify({ runtimeId: 'codex' }, null, 2)}\n`
  );
  const settings = readRuntimeSettings();
  assert.equal(settings.defaultRuntimeId, 'codex');
  assert.equal(fs.existsSync(path.join(dir, 'ai-runtime-settings.json')), true);
  assert.equal(writeRuntimeId('claude-code'), 'claude-code');
  assert.equal(readRuntimeId(), 'claude-code');
  setRuntimeDataDir(undefined);
});
