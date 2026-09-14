import { spawn } from 'child_process';
import path from 'path';
import { traceExternal } from '@true-north/dev-lab/collector';
import { consumeJsonl } from '../jsonl';
import { hasEnvCredential, helpIncludes, probeVersion, runCli } from '../cli';
import { registerChildProcess } from '../process-registry';
import { prepareClaudeWorkspace } from '../workspace';
import { agentDef } from '../registry';
import type { RuntimeSpawnInput, RuntimeSpawnResult } from '../types';
import type { RuntimeAdapter } from './types';
import { extractClaudeDelta, type ClaudeEventState } from './claude-events';

function parseLoggedIn(stdout: string, status: number | null): boolean {
  const trimmed = stdout.trim();
  if (trimmed) {
    try {
      const parsed = JSON.parse(trimmed) as { loggedIn?: unknown; logged_in?: unknown };
      if (typeof parsed.loggedIn === 'boolean') return parsed.loggedIn;
      if (typeof parsed.logged_in === 'boolean') return parsed.logged_in;
    } catch {
      // fall through to exit status
    }
  }
  return status === 0;
}

async function spawnClaude(input: RuntimeSpawnInput): Promise<RuntimeSpawnResult> {
  return traceExternal(
    {
      kind: 'spawn',
      streamId: input.streamId,
      summary: `${path.basename(input.binPath)} -p`,
      detail: { bin: path.basename(input.binPath), resume: Boolean(input.resumeThreadId) },
    },
    (span) => spawnClaudeProcess(input, span.setDetail)
  );
}

async function spawnClaudeProcess(
  input: RuntimeSpawnInput,
  setDetail: (detail: unknown) => void
): Promise<RuntimeSpawnResult> {
  const { binPath, workspaceDir, mcpUrl, prompt, resumeThreadId, signal } = input;
  prepareClaudeWorkspace(workspaceDir);
  const args = [
    '-p',
    '--output-format',
    'stream-json',
    '--verbose',
    '--include-partial-messages',
    '--permission-mode',
    'dontAsk',
    '--allowedTools',
    'mcp__true_north__*',
    '--mcp-config',
    JSON.stringify({
      mcpServers: {
        true_north: {
          type: 'http',
          url: mcpUrl,
        },
      },
    }),
    '--strict-mcp-config',
  ];
  if (await helpIncludes(binPath, ['-p', '--help'], '--permission-prompts')) {
    args.push('--permission-prompts', 'none');
  }
  if (resumeThreadId) {
    args.push('--resume', resumeThreadId);
  }
  args.push(prompt);

  const child = spawn(binPath, args, {
    cwd: workspaceDir,
    env: process.env,
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  registerChildProcess(input.streamId, child);

  if (signal.aborted) {
    child.kill('SIGINT');
  } else {
    signal.addEventListener('abort', () => {
      if (!child.killed) child.kill('SIGINT');
    });
  }

  let threadId = resumeThreadId;
  let state: ClaudeEventState = { lastText: '', sessionId: resumeThreadId };
  const stderrChunks: string[] = [];
  child.stderr?.on('data', (chunk) => {
    stderrChunks.push(String(chunk));
  });

  const exitPromise = new Promise<number | null>((resolve) => {
    child.once('exit', (code) => resolve(code));
    child.once('error', () => resolve(1));
  });

  if (child.stdout) {
    await consumeJsonl(child.stdout, (event) => {
      const parsed = extractClaudeDelta(event, state);
      state = parsed.next;
      if (parsed.sessionId) {
        threadId = parsed.sessionId;
        input.onThreadId(parsed.sessionId);
      }
      if (parsed.delta) input.onDelta(parsed.delta);
    });
  }

  const exitCode = await exitPromise;
  const stderr = stderrChunks.join('');
  setDetail({
    bin: path.basename(binPath),
    exitCode,
    stderr: stderr.trim().slice(0, 800),
  });

  return { threadId, exitCode, stderr };
}

const def = agentDef('claude-code')!;

export const claudeCodeAdapter: RuntimeAdapter = {
  id: 'claude-code',
  name: def.name,
  binaries: def.binaries,
  def,
  unavailableInstallReason: () => '未安装 Claude Code',
  probeVersion,
  async probeAuth(binPath) {
    if (hasEnvCredential(['ANTHROPIC_API_KEY', 'CLAUDE_CODE_OAUTH_TOKEN'])) return true;
    const result = await runCli(binPath, ['auth', 'status']);
    return parseLoggedIn(result.stdout, result.status);
  },
  async prepareWorkspace(input) {
    prepareClaudeWorkspace(input.workspaceDir);
    return { cwd: input.workspaceDir };
  },
  spawn: spawnClaude,
};
