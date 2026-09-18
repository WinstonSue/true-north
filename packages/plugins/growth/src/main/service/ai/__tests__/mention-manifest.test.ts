import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const manifest = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../../../manifest.ts'),
  'utf8',
);

test('goal and task resources opt into composer mentions', () => {
  assert.match(
    manifest,
    /goal: \{ uriTemplate: 'tn:\/\/growth\/goals\/\{id\}', mention: \{ labelKey: 'menu.goal', order: 10 \} \}/,
  );
  assert.match(
    manifest,
    /task: \{ uriTemplate: 'tn:\/\/growth\/tasks\/\{id\}', mention: \{ labelKey: 'menu.task', order: 20 \} \}/,
  );
});
