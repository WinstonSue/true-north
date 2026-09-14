import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { resolveOverridePath } from '../binary.ts';

test('override path requires a runnable absolute file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tn-bin-'));
  const missing = path.join(dir, 'missing');
  assert.equal(resolveOverridePath(missing), undefined);

  const file = path.join(dir, 'agent');
  fs.writeFileSync(file, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(file, 0o755);
  assert.equal(resolveOverridePath(file), file);
  assert.equal(resolveOverridePath('agent'), undefined);
});
