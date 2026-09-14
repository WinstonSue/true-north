const SENSITIVE_KEY = /password|apiKey|authorization|secret|token/i;
const MAX_BYTES = 8 * 1024;
const MAX_DEPTH = 8;
const MAX_ARRAY = 40;

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? 'null';
  } catch {
    return String(value);
  }
}

function redact(value: unknown, depth = 0): unknown {
  if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'string') return value;
  if (depth >= MAX_DEPTH) return '[…]';
  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY).map((item) => redact(item, depth + 1));
  }
  if (typeof value !== 'object') return String(value);
  const output: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    output[key] = SENSITIVE_KEY.test(key) ? '[redacted]' : redact(nested, depth + 1);
  }
  return output;
}

export function sanitizeTraceValue(value: unknown): unknown {
  if (value === undefined) return undefined;
  const redacted = redact(value);
  const json = stringify(redacted);
  if (json.length <= MAX_BYTES) return redacted;
  return `${json.slice(0, MAX_BYTES)}…`;
}

export function summarizeSql(query: string): string {
  const compact = query.replace(/\s+/g, ' ').trim();
  if (compact.length <= 180) return compact;
  return `${compact.slice(0, 180)}…`;
}

export function summarizeAiStreamRequest(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return undefined;
  const record = payload as Record<string, unknown>;
  const text = typeof record.text === 'string' ? record.text : '';
  const entityCount = Array.isArray(record.entityLinks) ? record.entityLinks.length : 0;
  return { textChars: text.length, entityCount };
}

export function summarizeAiStreamResponse(result: unknown): unknown {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return undefined;
  const record = result as { code?: unknown; data?: unknown };
  const data: Record<string, unknown> =
    record.data && typeof record.data === 'object' && !Array.isArray(record.data)
      ? (record.data as Record<string, unknown>)
      : (result as Record<string, unknown>);
  const user = data.user && typeof data.user === 'object' ? (data.user as { id?: unknown }) : undefined;
  const assistant =
    data.assistant && typeof data.assistant === 'object'
      ? (data.assistant as { id?: unknown })
      : undefined;
  return {
    code: record.code,
    streamId: typeof data.streamId === 'string' ? data.streamId : undefined,
    userId: typeof user?.id === 'string' ? user.id : undefined,
    assistantId: typeof assistant?.id === 'string' ? assistant.id : undefined,
  };
}

export function isSchemaSql(query: string): boolean {
  const sql = query.replace(/\s+/g, ' ').trim().toUpperCase();
  return (
    sql.startsWith('PRAGMA ') ||
    sql.includes('SQLITE_MASTER') ||
    sql.startsWith('CREATE TABLE') ||
    sql.startsWith('CREATE INDEX') ||
    sql.startsWith('DROP TABLE') ||
    sql.startsWith('ALTER TABLE') ||
    sql.startsWith('BEGIN') ||
    sql.startsWith('COMMIT') ||
    sql.startsWith('ROLLBACK') ||
    sql.startsWith('SAVEPOINT') ||
    sql.startsWith('RELEASE')
  );
}
