import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePluginPackageRoot, resolveSkillRoots, validateSkillRoots } from '../src/skills.ts';

test('validateSkillRoots requires SKILL.md with content', () => {
  const root = mkdtempSync(join(tmpdir(), 'tn-skill-'));
  try {
    const missing = join(root, 'missing');
    mkdirSync(missing);
    const empty = join(root, 'empty');
    mkdirSync(empty);
    writeFileSync(join(empty, 'SKILL.md'), '   ');
    const ok = join(root, 'ok');
    mkdirSync(ok);
    writeFileSync(join(ok, 'SKILL.md'), '# Skill\n');

    const issues = validateSkillRoots('growth', {
      missing,
      empty,
      ok,
    });
    assert.equal(issues.some((issue) => issue.message.includes('"missing"')), true);
    assert.equal(issues.some((issue) => issue.message.includes('"empty"')), true);
    assert.equal(issues.some((issue) => issue.message.includes('"ok"')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('resolvePluginPackageRoot finds first-party plugin from source or node_modules', () => {
  const fromSource = fileURLToPath(
    new URL('../../plugins/growth/src/main/contribution.ts', import.meta.url),
  );
  const packageRoot = resolvePluginPackageRoot('@true-north/plugin-growth', fromSource);
  assert.match(packageRoot, /packages\/plugins\/growth$/);
  assert.equal(
    resolveSkillRoots(packageRoot, { goalDecompose: { root: 'skills/goal-decompose' } }).goalDecompose,
    join(packageRoot, 'skills/goal-decompose'),
  );
});

test('desktop host skills resolve from the package root, not dist/main', () => {
  const fromSource = fileURLToPath(
    new URL('../../../apps/desktop/src/service/workflow/ai/index.ts', import.meta.url),
  );
  const packageRoot = resolvePluginPackageRoot('true-north-desktop', fromSource);
  assert.match(packageRoot, /apps\/desktop$/);
  const roots = resolveSkillRoots(packageRoot, { conflictAssist: { root: 'skills/conflict-assist' } });
  assert.equal(roots.conflictAssist, join(packageRoot, 'skills/conflict-assist'));
  assert.doesNotMatch(roots.conflictAssist, /dist\/main\/skill/);
  assert.equal(validateSkillRoots('workflow', roots).length, 0);
  assert.equal(
    validateSkillRoots('workflow', { conflictAssist: join(packageRoot, 'dist/main/skill') }).length > 0,
    true,
  );
});
