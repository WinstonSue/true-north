import type { AiMessagePartVo, AiTextPartVo, AiWorkspacePartVo } from '@true-north/vo';

type LegacyWorkspacePart = Omit<AiWorkspacePartVo, 'workspaceId'> & { workspaceId?: string };

const ARCHIVE_KEYS: Record<string, string> = {
  'activity.capture': '历史收集建议（只读归档）',
  'purchase.suggestPurchase': '历史采购建议（只读归档）',
};

function archiveTitle(payload: Record<string, unknown> | undefined, fallbackKey: string): string {
  if (fallbackKey === 'activity.capture') {
    const suggestions = Array.isArray(payload?.suggestions) ? payload.suggestions : [];
    const titles = suggestions
      .map((item) => (item && typeof item === 'object' && 'title' in item ? String((item as { title?: string }).title || '') : ''))
      .filter(Boolean);
    return titles.length ? `${ARCHIVE_KEYS[fallbackKey]}：${titles.join('；')}` : ARCHIVE_KEYS[fallbackKey];
  }
  const title = payload?.title ? String(payload.title) : '';
  return title ? `${ARCHIVE_KEYS[fallbackKey]}：${title}` : ARCHIVE_KEYS[fallbackKey];
}

export function archiveCapturePart(part: AiWorkspacePartVo | LegacyWorkspacePart): AiTextPartVo | AiWorkspacePartVo {
  const label = ARCHIVE_KEYS[part.workspaceKey];
  if (!label) return ensureWorkspacePart(part, 0);
  return {
    type: 'text',
    text: archiveTitle(part.payload, part.workspaceKey),
  };
}

export function ensureWorkspacePart(part: LegacyWorkspacePart, index: number): AiWorkspacePartVo {
  return { ...part, workspaceId: part.workspaceId || `legacy-${index}` };
}

export function migrateMessageParts(parts: Array<AiMessagePartVo | LegacyWorkspacePart> | undefined): AiMessagePartVo[] {
  return (parts || []).map((part, index) => {
    if (part.type !== 'workspace') return part;
    const withId = ensureWorkspacePart(part, index);
    return archiveCapturePart(withId);
  });
}
