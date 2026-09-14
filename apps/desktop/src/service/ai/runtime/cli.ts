import { spawn } from 'child_process';

export function hasEnvCredential(keys: string[], env: NodeJS.ProcessEnv = process.env): boolean {
  return keys.some((key) => Boolean(env[key]?.trim()));
}

export function runCli(
  binPath: string,
  args: string[],
  options?: { timeoutMs?: number; env?: NodeJS.ProcessEnv }
): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(binPath, args, {
      env: options?.env || process.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];
    child.stdout?.on('data', (chunk) => stdoutChunks.push(String(chunk)));
    child.stderr?.on('data', (chunk) => stderrChunks.push(String(chunk)));
    const timer = setTimeout(() => {
      if (child.exitCode === null && !child.killed) {
        try {
          child.kill('SIGTERM');
        } catch {
          // ignore
        }
      }
    }, options?.timeoutMs ?? 12_000);
    const finish = (status: number | null) => {
      clearTimeout(timer);
      resolve({
        status,
        stdout: stdoutChunks.join(''),
        stderr: stderrChunks.join(''),
      });
    };
    child.once('exit', (code) => finish(code));
    child.once('error', () => finish(1));
  });
}

export async function probeVersion(binPath: string): Promise<string | undefined> {
  const result = await runCli(binPath, ['--version'], { timeoutMs: 8_000 });
  const text = `${result.stdout}\n${result.stderr}`.trim();
  const line = text.split('\n').map((item) => item.trim()).find(Boolean);
  return line || undefined;
}

export async function helpIncludes(binPath: string, args: string[], flag: string): Promise<boolean> {
  const result = await runCli(binPath, args, { timeoutMs: 8_000 });
  return `${result.stdout}\n${result.stderr}`.includes(flag);
}
