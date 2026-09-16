import { extensionPoints } from '@true-north/plugin-sdk';
import { getMainExtensionsOptional } from '../../plugin/extensions.ts';

export async function listMcpResources() {
  const registry = getMainExtensionsOptional();
  const resources = registry?.list(extensionPoints.mcpResource) || [];
  const listed = await Promise.all(
    resources.map(async (item) => {
      try {
        const rows = await item.provider.list();
        return rows.map((row) => ({
          uri: row.uri,
          name: row.name || item.localId,
          mimeType: row.mimeType,
          pluginId: item.pluginId,
        }));
      } catch {
        return [];
      }
    }),
  );
  return listed.flat();
}

export function listResourceTemplates() {
  return (getMainExtensionsOptional()?.list(extensionPoints.mcpResource) || [])
    .filter((item) => item.uriTemplate.includes('{'))
    .map((item) => ({
      uriTemplate: item.uriTemplate,
      name: `${item.pluginId}.${item.localId}`,
    }));
}

export async function readMcpResource(uri: string) {
  for (const item of getMainExtensionsOptional()?.list(extensionPoints.mcpResource) || []) {
    const content = await item.provider.read(uri);
    if (content) return content;
  }
  return null;
}

export function listMcpPrompts() {
  return (getMainExtensionsOptional()?.list(extensionPoints.mcpPrompt) || []).map((item) => ({
    name: item.name,
    description: item.provider.description,
    arguments: item.provider.arguments,
  }));
}

export async function getMcpPrompt(name: string, args: Record<string, string>) {
  const found = getMainExtensionsOptional()?.get(extensionPoints.mcpPrompt, name);
  if (!found) return null;
  return found.provider.get(args);
}

export function allSkillRoots() {
  const grouped = new Map<string, Record<string, string>>();
  for (const skill of getMainExtensionsOptional()?.list(extensionPoints.skill) || []) {
    const roots = grouped.get(skill.pluginId) || {};
    roots[skill.localId] = skill.root;
    grouped.set(skill.pluginId, roots);
  }
  return [...grouped.entries()].map(([pluginId, roots]) => ({ pluginId, roots }));
}

export function getAgentInstructions(): string {
  return (getMainExtensionsOptional()?.list(extensionPoints.agentInstruction) || []).join('\n\n');
}

export const MENTION_LIMIT = 12;

export async function searchResourceMentions(query = '') {
  const keyword = query.trim().toLowerCase();
  const mentions = getMainExtensionsOptional()?.listRecords(extensionPoints.mention) || [];
  const groups = await Promise.all(
    mentions.map(async (entry) => {
      try {
        const rows = entry.value.provider.search
          ? await entry.value.provider.search(keyword)
          : (await entry.value.provider.list()).filter(
              (row) => !keyword || (row.name || '').toLowerCase().includes(keyword),
            );
        return rows.map((row) => ({
          uri: row.uri,
          label: row.name || row.uri,
          sourceId: entry.key,
          labelKey: entry.value.labelKey,
        }));
      } catch {
        return [];
      }
    }),
  );
  return groups.flat().slice(0, MENTION_LIMIT);
}
