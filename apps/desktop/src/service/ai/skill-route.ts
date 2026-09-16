import { contributionKey } from '@true-north/plugin-contract';
import { extensionPoints, type SkillExtension } from '@true-north/plugin-sdk';
import { getMainExtensionsOptional } from '../../plugin/extensions.ts';
import {
  WORKFLOW_CONFLICT_SKILL_ID,
  WORKFLOW_CONFLICT_SKILL_LOCAL_ID,
} from '../../plugin/host-ids.ts';

export type SkillRef = {
  pluginId: string;
  localId: string;
  id: string;
};

export function skillWorkspacePath(pluginId: string, localId: string): string {
  return `skills/${pluginId}/${localId}/SKILL.md`;
}

export function canonicalizeSkillId(raw?: string | null): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (value === WORKFLOW_CONFLICT_SKILL_LOCAL_ID) return WORKFLOW_CONFLICT_SKILL_ID;
  return value;
}

export function skillRefFromId(id: string): SkillRef | undefined {
  const canonical = canonicalizeSkillId(id);
  if (!canonical) return undefined;
  const split = canonical.indexOf('.');
  if (split <= 0 || split === canonical.length - 1) return undefined;
  return {
    id: canonical,
    pluginId: canonical.slice(0, split),
    localId: canonical.slice(split + 1),
  };
}

export function skillRefOf(skill: Pick<SkillExtension, 'pluginId' | 'localId'>): SkillRef {
  return {
    pluginId: skill.pluginId,
    localId: skill.localId,
    id: contributionKey(skill.pluginId, skill.localId),
  };
}

export function findRegisteredSkill(
  raw: string | undefined,
  skills: Array<Pick<SkillExtension, 'pluginId' | 'localId'>>,
): SkillRef | undefined {
  const id = canonicalizeSkillId(raw);
  if (!id) return undefined;
  return skills.map(skillRefOf).find((item) => item.id === id);
}

export function registeredSkills(): SkillExtension[] {
  return getMainExtensionsOptional()?.list(extensionPoints.skill) || [];
}

export function resolveConversationSkill(raw?: string | null): SkillRef | undefined {
  const id = canonicalizeSkillId(raw);
  if (!id) return undefined;
  const found = findRegisteredSkill(id, registeredSkills());
  if (!found) {
    throw new Error(`未知 Skill: ${id}`);
  }
  return found;
}

export function formatSkillDirective(skill: SkillRef): string {
  return `指定 Skill：${skill.id}\n执行前读取：${skillWorkspacePath(skill.pluginId, skill.localId)}`;
}
