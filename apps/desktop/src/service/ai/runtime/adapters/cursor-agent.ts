import { spawn } from 'child_process';
import { Readable, Writable } from 'node:stream';
import path from 'path';
import {
  client,
  ndJsonStream,
  PROTOCOL_VERSION,
  type McpServer,
  type RequestPermissionRequest,
} from '@agentclientprotocol/sdk';
import { traceExternal } from '@true-north/dev-lab/collector';
import { hasEnvCredential, probeVersion, runCli } from '../cli';
import { interruptThenKill, registerCancelHandle, registerChildProcess } from '../process-registry';
import { prepareCursorWorkspace } from '../workspace';
import { agentDef } from '../registry';
import type { RuntimeSpawnInput, RuntimeSpawnResult } from '../types';
import type { RuntimeAdapter } from './types';
import {
  cursorHttpMcpServer,
  extractCursorAgentText,
  formatAcpError,
  permissionOptionId,
  shouldAllowCursorPermission,
} from './cursor-events';

function parseCursorAuth(stdout: string): boolean | undefined {
  const trimmed = stdout.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = JSON.parse(trimmed) as { isAuthenticated?: unknown; status?: unknown };
    if (typeof parsed.isAuthenticated === 'boolean') return parsed.isAuthenticated;
    if (parsed.status === 'authenticated') return true;
    if (parsed.status === 'unauthenticated') return false;
  } catch {
    return undefined;
  }
  return undefined;
}

function mcpServers(mcpUrl: string, http: boolean): McpServer[] {
  if (!http) return [];
  return [cursorHttpMcpServer(mcpUrl)];
}

async function spawnCursor(input: RuntimeSpawnInput): Promise<RuntimeSpawnResult> {
  return traceExternal(
    {
      kind: 'spawn',
      streamId: input.streamId,
      summary: `${path.basename(input.binPath)} acp`,
      detail: { bin: path.basename(input.binPath), resume: Boolean(input.resumeThreadId) },
    },
    (span) => spawnCursorAcp(input, span.setDetail)
  );
}

async function spawnCursorAcp(
  input: RuntimeSpawnInput,
  setDetail: (detail: unknown) => void
): Promise<RuntimeSpawnResult> {
  const { binPath, workspaceDir, mcpUrl, prompt, resumeThreadId, signal } = input;
  prepareCursorWorkspace(workspaceDir);

  const child = spawn(binPath, ['acp'], {
    cwd: workspaceDir,
    env: process.env,
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (!child.stdin || !child.stdout) {
    return { exitCode: 1, stderr: 'Cursor Agent 未提供 stdio' };
  }

  const stderrChunks: string[] = [];
  child.stderr?.on('data', (chunk) => {
    stderrChunks.push(String(chunk));
  });

  const exitPromise = new Promise<number | null>((resolve) => {
    child.once('exit', (code) => resolve(code));
    child.once('error', () => resolve(1));
  });

  const stream = ndJsonStream(
    Writable.toWeb(child.stdin) as WritableStream<Uint8Array>,
    Readable.toWeb(child.stdout) as ReadableStream<Uint8Array>
  );

  let threadId = resumeThreadId;
  let replay = Boolean(resumeThreadId);
  let cancelled = false;

  try {
    await client({ name: 'true-north' })
      .onRequest('session/request_permission', async ({ params }) => {
        const request = params as RequestPermissionRequest;
        const allow = shouldAllowCursorPermission(request, workspaceDir);
        const optionId = permissionOptionId(request.options, allow ? 'allow' : 'reject');
        return {
          outcome: {
            outcome: 'selected',
            optionId,
          },
        };
      })
      .onRequest('cursor/ask_question', (params: unknown) => params, async () => ({
        outcome: { outcome: 'skipped' },
      }))
      .onRequest('cursor/create_plan', (params: unknown) => params, async () => ({
        outcome: { outcome: 'accepted' },
      }))
      .onNotification('session/update', ({ params }) => {
        if (replay) return;
        const update = (params as { update?: unknown }).update;
        const text = extractCursorAgentText(update);
        if (text) input.onDelta(text);
      })
      .connectWith(stream, async (ctx) => {
        const init = await ctx.request('initialize', {
          protocolVersion: PROTOCOL_VERSION,
          clientInfo: { name: 'true-north', version: '1.0.0' },
          clientCapabilities: {
            fs: { readTextFile: false, writeTextFile: false },
          },
        });
        const httpMcp = Boolean(
          (init.agentCapabilities as { mcpCapabilities?: { http?: boolean } } | undefined)?.mcpCapabilities
            ?.http
        );
        const servers = mcpServers(mcpUrl, httpMcp);
        if (!httpMcp) {
          throw new Error('Cursor Agent 不支持 HTTP MCP，无法接入本机工具');
        }

        const capabilities = init.agentCapabilities as
          | {
              loadSession?: boolean;
              sessionCapabilities?: { resume?: unknown; close?: unknown };
            }
          | undefined;
        const canResume = Boolean(capabilities?.sessionCapabilities?.resume);
        const canLoad = Boolean(capabilities?.loadSession);
        const canClose = Boolean(capabilities?.sessionCapabilities?.close);

        if (resumeThreadId && canResume) {
          await ctx.request('session/resume', {
            sessionId: resumeThreadId,
            cwd: workspaceDir,
            mcpServers: servers,
          });
          threadId = resumeThreadId;
          replay = false;
        } else if (resumeThreadId && canLoad) {
          await ctx.request('session/load', {
            sessionId: resumeThreadId,
            cwd: workspaceDir,
            mcpServers: servers,
          });
          threadId = resumeThreadId;
          replay = false;
        } else {
          replay = false;
          const created = await ctx.buildSession(workspaceDir).withMcpServer(servers[0]).start();
          threadId = created.sessionId;
          input.onThreadId(created.sessionId);
        }

        if (threadId) input.onThreadId(threadId);

        const cancel = async () => {
          if (cancelled) return;
          cancelled = true;
          if (threadId) {
            try {
              await ctx.notify('session/cancel', { sessionId: threadId });
            } catch {
              // ignore
            }
          }
          if (canClose && threadId) {
            try {
              await ctx.request('session/close', { sessionId: threadId });
            } catch {
              // ignore
            }
          }
          await interruptThenKill(child);
        };

        registerCancelHandle(input.streamId, { cancel });
        if (signal.aborted) {
          await cancel();
          return;
        }
        signal.addEventListener('abort', () => {
          void cancel();
        });

        await ctx.request('session/prompt', {
          sessionId: threadId,
          prompt: [{ type: 'text', text: prompt }],
        });
      });
  } catch (error) {
    const message = formatAcpError(error);
    stderrChunks.push(message);
    if (!signal.aborted) {
      setDetail({ bin: path.basename(binPath), error: message.slice(0, 800) });
      return {
        threadId,
        exitCode: 1,
        stderr: stderrChunks.join('\n'),
      };
    }
  } finally {
    registerChildProcess(input.streamId, child);
  }

  const stderr = stderrChunks.join('');
  if (!signal.aborted) {
    // ACP 回合结束后关掉 stdin 会让 agent 以 SIGINT(130) 退出，不能当成生成失败。
    void interruptThenKill(child);
    setDetail({
      bin: path.basename(binPath),
      exitCode: 0,
      stderr: stderr.trim().slice(0, 800),
    });
    return { threadId, exitCode: 0, stderr };
  }

  await exitPromise;
  setDetail({
    bin: path.basename(binPath),
    exitCode: 0,
    stderr: stderr.trim().slice(0, 800),
  });
  return { threadId, exitCode: 0, stderr };
}

const def = agentDef('cursor-agent')!;

export const cursorAgentAdapter: RuntimeAdapter = {
  id: 'cursor-agent',
  name: def.name,
  binaries: def.binaries,
  def,
  extraSearchDirs: () => [path.join(process.env.HOME || '', '.local', 'bin')],
  unavailableInstallReason: () => '未安装 Cursor Agent',
  probeVersion,
  async probeAuth(binPath) {
    if (hasEnvCredential(['CURSOR_API_KEY', 'CURSOR_AUTH_TOKEN'])) return true;
    const result = await runCli(binPath, ['status', '--format', 'json']);
    return parseCursorAuth(result.stdout) === true;
  },
  async prepareWorkspace(input) {
    prepareCursorWorkspace(input.workspaceDir);
    return { cwd: input.workspaceDir };
  },
  spawn: spawnCursor,
};
