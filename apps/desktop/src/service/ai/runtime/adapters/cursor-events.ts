import { RequestError } from '@agentclientprotocol/sdk';

export type CursorHttpMcpServer = {
  type: 'http';
  name: string;
  url: string;
  headers: Array<{ name: string; value: string }>;
};

const ACP_ERROR_DETAIL_LIMIT = 240;
const SECRET_RE = /authorization|api[-_]?key|token|secret|cookie|bearer|password/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function extractCursorAgentText(update: unknown): string | undefined {
  if (!isRecord(update)) return undefined;
  const kind = asString(update.sessionUpdate) || asString(update.session_update);
  if (kind !== 'agent_message_chunk') return undefined;
  const content = isRecord(update.content) ? update.content : undefined;
  if (!content) return undefined;
  const type = asString(content.type);
  if (type && type !== 'text') return undefined;
  const text = asString(content.text);
  return text || undefined;
}

export function permissionOptionId(
  options: Array<{ optionId?: string; kind?: string }> | undefined,
  prefer: 'allow' | 'reject'
): string {
  const list = options || [];
  if (prefer === 'allow') {
    return (
      list.find((item) => item.optionId === 'allow-once')?.optionId ||
      list.find((item) => item.optionId === 'allow-always')?.optionId ||
      list.find((item) => item.kind === 'allow_once' || item.kind === 'allow_always')?.optionId ||
      'allow-once'
    );
  }
  return (
    list.find((item) => item.optionId === 'reject-once')?.optionId ||
    list.find((item) => item.optionId === 'reject-always')?.optionId ||
    'reject-once'
  );
}

function pathInside(workspaceDir: string, candidate: string): boolean {
  const root = workspaceDir.endsWith('/') ? workspaceDir : `${workspaceDir}/`;
  return candidate === workspaceDir || candidate.startsWith(root);
}

export function shouldAllowCursorPermission(params: unknown, workspaceDir: string): boolean {
  if (!isRecord(params)) return false;
  const toolCall = isRecord(params.toolCall) ? params.toolCall : undefined;
  const rawInput = toolCall && isRecord(toolCall.rawInput) ? toolCall.rawInput : undefined;
  const title = toolCall ? asString(toolCall.title) || '' : '';
  const kind = toolCall ? asString(toolCall.kind) || '' : '';
  const haystack = `${title} ${kind} ${JSON.stringify(rawInput || {})}`.toLowerCase();
  if (haystack.includes('true_north') || haystack.includes('mcp')) {
    return haystack.includes('true_north') || haystack.includes('true-north');
  }

  const locations = toolCall && Array.isArray(toolCall.locations) ? toolCall.locations : [];
  const paths = [
    rawInput ? asString(rawInput.path) : undefined,
    rawInput ? asString(rawInput.file) : undefined,
    rawInput ? asString(rawInput.absolutePath) : undefined,
    ...locations.map((item) => (isRecord(item) ? asString(item.path) : undefined)),
  ].filter((item): item is string => Boolean(item));
  if (paths.length && paths.every((item) => pathInside(workspaceDir, item))) return true;
  if (!paths.length && (kind.includes('read') || kind.includes('edit') || kind.includes('search'))) {
    return true;
  }
  return false;
}

export function cursorHttpMcpServer(mcpUrl: string): CursorHttpMcpServer {
  return {
    type: 'http',
    name: 'true_north',
    url: mcpUrl,
    headers: [],
  };
}

function truncateDetail(value: string): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= ACP_ERROR_DETAIL_LIMIT) return compact;
  return `${compact.slice(0, ACP_ERROR_DETAIL_LIMIT)}…`;
}

function summarizeAcpData(data: unknown): string | undefined {
  if (data == null) return undefined;
  if (typeof data === 'string') {
    if (SECRET_RE.test(data)) return undefined;
    return truncateDetail(data);
  }
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);
  if (!isRecord(data) && !Array.isArray(data)) return undefined;
  const nested = isRecord(data)
    ? data.message ?? data.error ?? data.reason ?? data.details
    : undefined;
  if (typeof nested === 'string' && nested.trim() && !SECRET_RE.test(nested)) {
    return truncateDetail(nested);
  }
  try {
    const json = JSON.stringify(data);
    if (!json || SECRET_RE.test(json)) return undefined;
    return truncateDetail(json);
  } catch {
    return undefined;
  }
}

function isRequestErrorLike(
  error: unknown
): error is { code: number; message: string; data?: unknown } {
  if (error instanceof RequestError) return true;
  return (
    isRecord(error) &&
    typeof error.code === 'number' &&
    typeof error.message === 'string'
  );
}

export function formatAcpError(error: unknown): string {
  if (isRequestErrorLike(error)) {
    const message = error.message.trim() || '请求失败';
    const detail = summarizeAcpData(error.data);
    if (error.code === -32603 || /internal error/i.test(message)) {
      const hint =
        'Cursor Agent 会话初始化失败。请确认已登录 Cursor，且本机 MCP 可被 Agent 访问。';
      if (detail && !/internal error/i.test(detail)) return `${hint}（${detail}）`;
      return hint;
    }
    return detail ? `${message}（${detail}）` : message;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}
