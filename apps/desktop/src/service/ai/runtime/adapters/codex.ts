import { spawn } from 'child_process';
import path from 'path';
import { traceExternal } from '@true-north/dev-lab/collector';
import { consumeJsonl, readString } from '../jsonl';
import { helpIncludes, hasEnvCredential, probeVersion, runCli } from '../cli';
import { interruptThenKill, registerChildProcess } from '../process-registry';
import { prepareCodexWorkspace } from '../workspace';
import { agentDef } from '../registry';
import type { RuntimeSpawnInput, RuntimeSpawnResult } from '../types';
import type { RuntimeAdapter } from './types';
import { extractDelta } from './codex-events';
import {
  CODEX_IDLE_TIMEOUT_MESSAGE,
  resolveCodexIdleTimeoutMs,
} from '../codex-config';

function needsFullAccess(
  platform: NodeJS.Platform = process.platform,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  if (platform === 'win32') return true;
  return Boolean(env.WSL_DISTRO_NAME?.trim());
}

export function execArgs(input: {
  resumeThreadId?: string;
  skipGitRepoCheck: boolean;
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
}): string[] {
  const resume = Boolean(input.resumeThreadId);
  const danger = needsFullAccess(input.platform, input.env);
  const sandboxArgs = danger
    ? resume
      ? ['-c', 'sandbox_mode="danger-full-access"']
      : ['--sandbox', 'danger-full-access']
    : resume
      ? ['-c', 'sandbox_mode="workspace-write"', '-c', 'sandbox_workspace_write.network_access=true']
      : ['--sandbox', 'workspace-write', '-c', 'sandbox_workspace_write.network_access=true'];

  const skipGit = input.skipGitRepoCheck ? ['--skip-git-repo-check'] : [];
  const approvalArgs = ['-c', 'approval_policy="never"'];
  const args = resume
    ? ['exec', 'resume', '--json', ...skipGit, ...sandboxArgs, ...approvalArgs]
    : ['exec', '--json', ...skipGit, ...sandboxArgs, ...approvalArgs];

  if (input.resumeThreadId) {
    args.push(input.resumeThreadId);
  }
  return args;
}

export async function spawnCodex(input: RuntimeSpawnInput): Promise<RuntimeSpawnResult> {
  return traceExternal(
    {
      kind: 'spawn',
      streamId: input.streamId,
      summary: `${path.basename(input.binPath)} exec`,
      detail: { bin: path.basename(input.binPath), resume: Boolean(input.resumeThreadId) },
    },
    (span) => spawnCodexProcess(input, span.setDetail)
  );
}

async function spawnCodexProcess(
  input: RuntimeSpawnInput,
  setDetail: (detail: unknown) => void
): Promise<RuntimeSpawnResult> {
  const { binPath, workspaceDir, mcpUrl, prompt, resumeThreadId, signal } = input;
  const codexHome = prepareCodexWorkspace(workspaceDir, mcpUrl);
  const args = execArgs({
    resumeThreadId,
    skipGitRepoCheck: await helpIncludes(binPath, ['exec', '--help'], '--skip-git-repo-check'),
  });

  const child = spawn(binPath, args, {
    cwd: workspaceDir,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
    },
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  registerChildProcess(input.streamId, child);

  if (signal.aborted) {
    void interruptThenKill(child);
  } else {
    signal.addEventListener('abort', () => {
      void interruptThenKill(child);
    });
  }

  child.stdin?.write(prompt);
  child.stdin?.end();

  let threadId = resumeThreadId;
  let lastAgentText = '';
  let idleTimedOut = false;
  const stderrChunks: string[] = [];
  const idleMs = resolveCodexIdleTimeoutMs();
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const bumpIdle = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      idleTimedOut = true;
      void interruptThenKill(child);
    }, idleMs);
  };
  bumpIdle();

  child.stderr?.on('data', (chunk) => {
    stderrChunks.push(String(chunk));
    bumpIdle();
  });

  const exitPromise = new Promise<number | null>((resolve) => {
    child.once('exit', (code) => resolve(code));
    child.once('error', () => resolve(1));
  });

  if (child.stdout) {
    await consumeJsonl(child.stdout, (event) => {
      bumpIdle();
      const type = readString(event.type);
      if (type === 'thread.started') {
        const nextId = readString(event.thread_id) || readString(event.threadId);
        if (nextId) {
          threadId = nextId;
          input.onThreadId(nextId);
        }
        return;
      }
      const parsed = extractDelta(event, lastAgentText);
      lastAgentText = parsed.nextLastAgentText;
      if (parsed.delta) input.onDelta(parsed.delta);
    });
  }

  const exitCode = await exitPromise;
  if (idleTimer) clearTimeout(idleTimer);
  const stderr = idleTimedOut
    ? [stderrChunks.join('').trim(), CODEX_IDLE_TIMEOUT_MESSAGE].filter(Boolean).join('\n')
    : stderrChunks.join('');
  setDetail({
    bin: path.basename(binPath),
    exitCode: idleTimedOut ? 1 : exitCode,
    stderr: stderr.trim().slice(0, 800),
  });

  return {
    threadId,
    exitCode: idleTimedOut ? 1 : exitCode,
    stderr,
  };
}

const def = agentDef('codex')!;

export const codexAdapter: RuntimeAdapter = {
  id: 'codex',
  name: def.name,
  binaries: def.binaries,
  def,
  unavailableInstallReason: () => '未安装 ChatGPT',
  probeVersion,
  async probeAuth(binPath) {
    if (hasEnvCredential(['CODEX_API_KEY', 'CODEX_ACCESS_TOKEN'])) return true;
    const result = await runCli(binPath, ['login', 'status']);
    return result.status === 0;
  },
  async prepareWorkspace(input) {
    prepareCodexWorkspace(input.workspaceDir, input.mcpUrl);
    return { cwd: input.workspaceDir };
  },
  spawn: spawnCodex,
};
