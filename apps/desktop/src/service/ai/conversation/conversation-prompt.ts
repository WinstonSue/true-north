import { canonicalizeSkillId, formatSkillDirective, skillRefFromId } from '../skill-route.ts';

type ResourceLink = { uri: string; label: string };
type Attachment = { uri: string; label?: string; skill?: string };
type MessagePart =
  | { type: 'text'; text?: string; resourceLinks?: ResourceLink[] }
  | {
      type: 'workspace';
      workspaceKey: string;
      payload: Record<string, unknown>;
    }
  | { type: 'tool'; toolName: string; status: string; resultSummary?: string; argsSummary?: string };

const HISTORY_TURN_CAP = 20;
const HISTORY_CHAR_CAP = 12_000;

function workspaceRef(payload: Record<string, unknown>): { type: string; id: string; label: string } | undefined {
  const ref = payload.ref;
  if (!ref || typeof ref !== 'object' || Array.isArray(ref)) return undefined;
  const candidate = ref as Record<string, unknown>;
  if (typeof candidate.type !== 'string' || typeof candidate.id !== 'string') return undefined;
  return {
    type: candidate.type,
    id: candidate.id,
    label: typeof candidate.label === 'string' ? candidate.label : candidate.id,
  };
}

export function formatAttachments(attachments: Attachment[] | null | undefined): string {
  if (!attachments?.length) return '';
  const lines = attachments.map((item) => `- ${item.label || item.uri} (${item.uri})`);
  const skillRefs = new Map<string, ReturnType<typeof skillRefFromId>>();
  for (const item of attachments) {
    const id = canonicalizeSkillId(item.skill);
    const ref = id ? skillRefFromId(id) : undefined;
    if (ref && !skillRefs.has(ref.id)) skillRefs.set(ref.id, ref);
  }
  for (const ref of skillRefs.values()) {
    if (!ref) continue;
    lines.push('', formatSkillDirective(ref));
  }
  return lines.join('\n');
}

export function formatResourceLinks(links: ResourceLink[] | null | undefined): string {
  if (!links?.length) return '';
  return links.map((item) => `- ${item.label} (${item.uri})`).join('\n');
}

export function textFromParts(parts: MessagePart[]): string {
  const texts: string[] = [];
  for (const part of parts) {
    if (part.type === 'text') {
      const body = part.text || '';
      const refs = formatResourceLinks(part.resourceLinks);
      texts.push(refs ? `${body}\n[引用:\n${refs}]`.trim() : body);
    } else if (part.type === 'workspace') {
      const ref = workspaceRef(part.payload);
      const refLabel = ref ? ` ${ref.type}:${ref.id} ${ref.label}` : '';
      const summary = typeof part.payload.analysisSummary === 'string' ? part.payload.analysisSummary : '';
      texts.push(`[工作台:${part.workspaceKey}${refLabel}] ${summary}`.trim());
    } else if (part.type === 'tool') {
      texts.push(`[工具:${part.toolName} ${part.status}] ${part.resultSummary || part.argsSummary || ''}`.trim());
    }
  }
  return texts.filter(Boolean).join('\n');
}

export function buildHistoryExcerpt(history: Array<{ role: string; parts?: MessagePart[] }>): string {
  const recent = history.slice(-HISTORY_TURN_CAP);
  const lines: string[] = [];
  let chars = 0;
  for (const item of recent) {
    const content = textFromParts(item.parts || []);
    if (!content.trim()) continue;
    const role = item.role === 'assistant' ? 'Assistant' : 'User';
    const line = `${role}: ${content}`;
    if (chars + line.length > HISTORY_CHAR_CAP && lines.length > 0) break;
    lines.push(line);
    chars += line.length;
  }
  return lines.join('\n');
}

export function buildRuntimePrompt(
  history: Array<{ role: string; parts?: MessagePart[] }>,
  resume: boolean,
  latestUserText: string,
): string {
  if (resume) return latestUserText;
  const excerpt = buildHistoryExcerpt(history);
  return excerpt || latestUserText;
}
