import assert from 'node:assert/strict';
import test from 'node:test';
import type { AgentTool, MaterializedMain } from '@true-north/plugin-sdk';
import { AgentToolRegistry } from '../../agent/tools.ts';
import { PluginAiRegistry } from '../../plugin-ai.registry.ts';

function dummyTool(name: string): AgentTool {
  return {
    name,
    description: `${name} tool`,
    parameters: { type: 'object', properties: {} },
    schema: { parse: (value: unknown) => value },
    execute: async () => JSON.stringify({ ok: true }),
  };
}

function dummyMain(overrides: Partial<MaterializedMain> = {}): MaterializedMain {
  return {
    issues: [],
    ipc: [],
    captureAdopters: [],
    todaySections: [],
    tools: [],
    resources: [],
    prompts: [],
    skillRoots: {},
    ...overrides,
  };
}

test('plugin AI registry namespaces tools, resources and prompts, then unregisters them', async () => {
  const registry = new PluginAiRegistry();
  const tools = new AgentToolRegistry();
  registry.register(
    'growth',
    dummyMain({
      tools: [dummyTool('growth.searchGoals')],
      resources: [
        {
          localId: 'goal',
          uriTemplate: 'tn://growth/goals/{id}',
          provider: {
            list: async () => [{ uri: 'tn://growth/goals/g1', name: 'Goal' }],
            read: async (uri) =>
              uri === 'tn://growth/goals/g1' ? { uri, text: '{"id":"g1"}', mimeType: 'application/json' } : null,
          },
        },
      ],
      prompts: [
        {
          localId: 'review',
          name: 'growth.review',
          provider: {
            description: 'Review a goal',
            get: async () => ({ messages: [{ role: 'user', content: { type: 'text', text: 'review' } }] }),
          },
        },
      ],
    }),
  );
  tools.register(registry.listTools());

  assert.equal(registry.findTool('growth.searchGoals')?.name, 'growth.searchGoals');
  assert.equal((await registry.listResources())[0]?.uri, 'tn://growth/goals/g1');
  assert.equal(registry.listResourceTemplates()[0]?.uriTemplate, 'tn://growth/goals/{id}');
  assert.equal(registry.listPrompts()[0]?.name, 'growth.review');
  assert.equal((await registry.getPrompt('growth.review', {}))?.messages[0]?.content.text, 'review');

  assert.throws(() => registry.register('other', dummyMain({ tools: [dummyTool('growth.searchGoals')] })), /重复注册 MCP 工具/);

  const removed = registry.unregister('growth');
  tools.unregister(removed);
  assert.equal(registry.findTool('growth.searchGoals'), undefined);
  assert.deepEqual(await registry.listResources(), []);
  assert.deepEqual(registry.listPrompts(), []);
  assert.equal(tools.find('growth.searchGoals'), undefined);
});
