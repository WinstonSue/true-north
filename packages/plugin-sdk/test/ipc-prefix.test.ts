import assert from 'node:assert/strict';
import test from 'node:test';
import { prefixPluginIpc } from '../src/ipc-prefix.ts';
import type { PluginIpcPort } from '../src/runtime.ts';

function captureIpc() {
  const calls: Array<{ method: string; path: string }> = [];
  const ipc: PluginIpcPort = {
    get: async <T = unknown>(path: string) => {
      calls.push({ method: 'get', path });
      return undefined as T;
    },
    post: async <T = unknown>(path: string) => {
      calls.push({ method: 'post', path });
      return undefined as T;
    },
    put: async <T = unknown>(path: string) => {
      calls.push({ method: 'put', path });
      return undefined as T;
    },
    remove: async <T = unknown>(path: string) => {
      calls.push({ method: 'remove', path });
      return undefined as T;
    },
  };
  return { ipc, calls };
}

test('host ai and workflow paths stay unprefixed; notifications do not', async () => {
  const { ipc, calls } = captureIpc();
  const pluginIpc = prefixPluginIpc(ipc, '/growth');
  await pluginIpc.get('/todos');
  await pluginIpc.get('/ai/conversations');
  await pluginIpc.get('/workflow/pending');
  await pluginIpc.get('/notifications/list');
  assert.deepEqual(
    calls.map((item) => item.path),
    ['/growth/todos', '/ai/conversations', '/workflow/pending', '/growth/notifications/list'],
  );
});

test('pluginId-equal localId still gets the plugin prefix', async () => {
  const { ipc, calls } = captureIpc();
  const pluginIpc = prefixPluginIpc(ipc, '/library');
  await pluginIpc.get('/library/bookmarks');
  await pluginIpc.post('/library/bookmarks');
  await pluginIpc.get('/ai/conversations');
  await pluginIpc.get('/workflow/pending');
  assert.deepEqual(
    calls.map((item) => item.path),
    [
      '/library/library/bookmarks',
      '/library/library/bookmarks',
      '/ai/conversations',
      '/workflow/pending',
    ],
  );
});
