import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');

test('habit ManyToMany goals does not cascade persist Goal tree nodes', () => {
  const src = readFileSync(
    join(repoRoot, 'packages/plugins/growth/src/main/service/habit/habit.entity.ts'),
    'utf8',
  );
  assert.match(src, /@ManyToMany\(\(\) => Goal\)/);
  assert.doesNotMatch(src, /@ManyToMany\(\(\) => Goal,\s*\{\s*cascade:\s*true\s*\}\)/);
});
