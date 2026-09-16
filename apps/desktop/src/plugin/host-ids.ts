import { contributionKey } from '@true-north/plugin-contract';
export { HOST_WORKBENCH_OPEN, HOST_BROWSER_OPEN } from '@true-north/plugin-sdk';

export const HOST_AI_STORE_ID = 'host:ai' as const;
export const HOST_WORKFLOW_STORE_ID = 'host:workflow' as const;
export const GROWTH_OPEN_FOCUS = 'growth.open-focus' as const;

export const WORKFLOW_PLUGIN_ID = 'workflow';
export const WORKFLOW_CONFLICT_SKILL_LOCAL_ID = 'conflictAssist';
export const WORKFLOW_CONFLICT_SKILL_ID = contributionKey(
  WORKFLOW_PLUGIN_ID,
  WORKFLOW_CONFLICT_SKILL_LOCAL_ID,
);

export const CONFLICT_RESOURCE_PREFIX = 'tn://workflow/conflicts/';

export function conflictResourceUri(ticketId: string): string {
  return `${CONFLICT_RESOURCE_PREFIX}${ticketId}`;
}

export function parseConflictResourceUri(uri: string): string | null {
  if (!uri.startsWith(CONFLICT_RESOURCE_PREFIX)) return null;
  const id = uri.slice(CONFLICT_RESOURCE_PREFIX.length).trim();
  return id || null;
}

export function conflictTicketIdFromAttachments(
  attachments?: Array<{ uri?: string }> | null,
): string | undefined {
  for (const item of attachments || []) {
    const id = item.uri ? parseConflictResourceUri(item.uri) : null;
    if (id) return id;
  }
  return undefined;
}

export function isConflictConversation(attachments?: Array<{ uri?: string }> | null): boolean {
  return Boolean(conflictTicketIdFromAttachments(attachments));
}
