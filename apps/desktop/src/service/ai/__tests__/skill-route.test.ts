import assert from 'node:assert/strict';
import test from 'node:test';
import { ExtensionRegistry, extensionPoints } from '@true-north/plugin-sdk';
import { attachMainExtensions } from '../../../plugin/extensions.ts';
import { allSkillRoots } from '../extension-queries.ts';
import {
  canonicalizeSkillId,
  findRegisteredSkill,
  formatSkillDirective,
  skillRefFromId,
  skillWorkspacePath,
} from '../skill-route.ts';

test('conflictAssist canonicalizes to workflow.conflictAssist and a workspace path', () => {
  assert.equal(canonicalizeSkillId('conflictAssist'), 'workflow.conflictAssist');
  assert.equal(canonicalizeSkillId('workflow.conflictAssist'), 'workflow.conflictAssist');
  assert.deepEqual(skillRefFromId('conflictAssist'), {
    id: 'workflow.conflictAssist',
    pluginId: 'workflow',
    localId: 'conflictAssist',
  });
  assert.equal(
    skillWorkspacePath('workflow', 'conflictAssist'),
    'skills/workflow/conflictAssist/SKILL.md',
  );
  assert.equal(
    formatSkillDirective(skillRefFromId('conflictAssist')!),
    '指定 Skill：workflow.conflictAssist\n执行前读取：skills/workflow/conflictAssist/SKILL.md',
  );
});

test('unknown skill ids are rejected and registered skills resolve', () => {
  const skills = [
    { pluginId: 'workflow', localId: 'conflictAssist' },
    { pluginId: 'growth', localId: 'goalDecompose' },
  ];
  assert.deepEqual(findRegisteredSkill('conflictAssist', skills)?.id, 'workflow.conflictAssist');
  assert.deepEqual(findRegisteredSkill('growth.goalDecompose', skills)?.id, 'growth.goalDecompose');
  assert.equal(findRegisteredSkill('workflow.missing', skills), undefined);
  assert.equal(findRegisteredSkill(undefined, skills), undefined);
});

test('skill roots group by pluginId even when registry owner is host', () => {
  const registry = new ExtensionRegistry();
  attachMainExtensions(registry);
  registry.register('host', extensionPoints.skill, 'workflow.conflictAssist', {
    pluginId: 'workflow',
    localId: 'conflictAssist',
    root: '/tmp/skills/conflict-assist',
  });
  const roots = allSkillRoots();
  assert.deepEqual(roots, [
    { pluginId: 'workflow', roots: { conflictAssist: '/tmp/skills/conflict-assist' } },
  ]);
  attachMainExtensions(null);
});
