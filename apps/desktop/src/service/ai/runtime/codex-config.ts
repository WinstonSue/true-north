const KEEP_ROOT_KEYS = new Set(['model', 'model_provider']);

export const CODEX_IDLE_TIMEOUT_MS = 90_000;

export function resolveCodexIdleTimeoutMs(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.TN_CODEX_IDLE_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : CODEX_IDLE_TIMEOUT_MS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : CODEX_IDLE_TIMEOUT_MS;
}

export const CODEX_IDLE_TIMEOUT_MESSAGE = '编码 Agent 长时间无响应，已结束';

function tomlQuoted(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function isKeptTable(header: string): boolean {
  return header === 'model_providers' || header.startsWith('model_providers.');
}

export function trueNorthCodexMcpConfig(mcpUrl: string): string {
  return `[mcp_servers.true_north]\nurl = ${tomlQuoted(mcpUrl)}\ndefault_tools_approval_mode = "approve"`;
}

export function buildCodexSessionConfig(userConfig: string, mcpUrl: string): string {
  const lines = userConfig.replace(/\r\n/g, '\n').split('\n');
  const root: string[] = [];
  const tables: string[] = [];
  let currentHeader: string | null = null;
  let keepCurrent = false;
  let currentLines: string[] = [];

  const flushTable = () => {
    if (currentHeader && keepCurrent) {
      tables.push(`[${currentHeader}]`, ...currentLines);
    }
    currentHeader = null;
    keepCurrent = false;
    currentLines = [];
  };

  for (const line of lines) {
    const table = line.match(/^\s*\[([^\]]+)\]\s*$/);
    if (table) {
      flushTable();
      currentHeader = table[1].trim();
      keepCurrent = isKeptTable(currentHeader);
      continue;
    }
    if (!currentHeader) {
      const key = line.match(/^\s*([A-Za-z0-9_]+)\s*=/);
      if (key && KEEP_ROOT_KEYS.has(key[1])) root.push(line.trimEnd());
      continue;
    }
    if (keepCurrent) currentLines.push(line);
  }
  flushTable();

  const kept = [...root, ...tables].join('\n').trim();
  const mcp = trueNorthCodexMcpConfig(mcpUrl);
  return `${kept ? `${kept}\n\n` : ''}${mcp}\n`;
}
