import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { interruptThenKill } from '../process-registry.ts';

test('interruptThenKill stops a long-running child', async () => {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
    stdio: 'ignore',
  });
  await interruptThenKill(child, 'SIGTERM', 200);
  await new Promise<void>((resolve) => {
    if (child.exitCode !== null || child.killed) {
      resolve();
      return;
    }
    child.once('exit', () => resolve());
  });
  assert.ok(child.killed || child.exitCode !== null);
});
