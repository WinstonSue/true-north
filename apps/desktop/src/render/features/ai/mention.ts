import type { AiResourceLinkVo, AiResourceMentionVo } from '@true-north/vo';

export type ComposerResourceLink = AiResourceLinkVo;

export function readMentionQuery(text: string, cursor: number): { start: number; query: string } | null {
  const before = text.slice(0, cursor);
  const match = before.match(/@([^\s@]*)$/);
  if (!match || match.index === undefined) return null;
  return { start: match.index, query: match[1] || '' };
}

export function resourceLinksInText(text: string, links: ComposerResourceLink[]): ComposerResourceLink[] {
  return links.filter((link) => text.includes(`@${link.label}`));
}

export function upsertResourceLink(
  links: ComposerResourceLink[],
  item: ComposerResourceLink,
): ComposerResourceLink[] {
  return links.some((link) => link.uri === item.uri) ? links : [...links, item];
}

export function mentionOptionId(uri: string): string {
  return `mention-${uri.replace(/[^a-zA-Z0-9]+/g, '-')}`;
}

export function cycleMentionIndex(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (index + delta + length) % length;
}

export function insertMentionToken(
  text: string,
  cursor: number,
  label: string,
): { text: string; cursor: number } | null {
  const current = readMentionQuery(text, cursor);
  if (!current) return null;
  const before = text.slice(0, current.start);
  const after = text.slice(cursor);
  const token = `@${label} `;
  return {
    text: `${before}${token}${after}`,
    cursor: `${before}${token}`.length,
  };
}

export function mentionKindLabel(
  item: Pick<AiResourceMentionVo, 'labelKey'>,
  messages: Record<string, string>,
): string {
  return messages[item.labelKey] || item.labelKey;
}

export type MentionTextSegment =
  | { type: 'text'; value: string }
  | { type: 'resource'; uri: string; label: string }
  | { type: 'entity'; key: string; label: string };

export type MentionSplitResult = {
  segments: MentionTextSegment[];
  unmatchedResources: ComposerResourceLink[];
  unmatchedEntities: Array<{ type: string; id: string; label: string }>;
};

function longestLabelFirst<T extends { label: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.label.length - a.label.length || a.label.localeCompare(b.label));
}

export function splitTextByMentions(
  text: string,
  resourceLinks: ComposerResourceLink[] = [],
  entityLinks: Array<{ type: string; id: string; label: string }> = [],
): MentionSplitResult {
  const remainingResources = [...resourceLinks];
  const remainingEntities = [...entityLinks];
  const segments: MentionTextSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const at = text.indexOf('@', cursor);
    if (at < 0) {
      segments.push({ type: 'text', value: text.slice(cursor) });
      break;
    }
    if (at > cursor) segments.push({ type: 'text', value: text.slice(cursor, at) });
    const rest = text.slice(at + 1);
    const resource = longestLabelFirst(remainingResources).find((link) => rest.startsWith(link.label));
    if (resource) {
      remainingResources.splice(remainingResources.indexOf(resource), 1);
      segments.push({ type: 'resource', uri: resource.uri, label: resource.label });
      cursor = at + 1 + resource.label.length;
      continue;
    }
    const entity = longestLabelFirst(remainingEntities).find((link) => rest.startsWith(link.label));
    if (entity) {
      remainingEntities.splice(remainingEntities.indexOf(entity), 1);
      segments.push({ type: 'entity', key: `${entity.type}-${entity.id}`, label: entity.label });
      cursor = at + 1 + entity.label.length;
      continue;
    }
    segments.push({ type: 'text', value: '@' });
    cursor = at + 1;
  }

  return {
    segments: segments.filter((segment) => segment.type !== 'text' || segment.value),
    unmatchedResources: remainingResources,
    unmatchedEntities: remainingEntities,
  };
}
