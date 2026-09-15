import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ExtensionRegistry,
  extensionPoints,
  type AgentTool,
  type MaterializedMain,
} from '@true-north/plugin-sdk';
import { attachMainExtensions } from '../../../../plugin/extensions.ts';
import { findAgentTool, listAgentTools } from '../../agent/tools.ts';
import { getMcpPrompt, listMcpResources, listResourceTemplates } from '../../extension-queries.ts';

function dummyTool(name: string): AgentTool {
  return {
    name,
    description: `${name} tool`,
    parameters: { type: 'object', properties: {} },
    schema: { parse: (value: unknown) => value },
    execute: async () => JSON.stringify({ ok: true }),
  };
}

function dummyMain(pluginId: string): MaterializedMain {
  return {
    issues: [],
    registrations: [
      {
        point: extensionPoints.mcpTool,
        key: 'growth.searchGoals',
        value: dummyTool('growth.searchGoals'),
      },
      {
        point: extensionPoints.mcpResource,
        key: 'growth.goal',
        value: {
          pluginId,
          localId: 'goal',
          uriTemplate: 'tn://growth/goals/{id}',
          provider: {
            list: async () => [{ uri: 'tn://growth/goals/g1', name: 'Goal' }],
            read: async (uri: string) =>
              uri === 'tn://growth/goals/g1' ? { uri, text: '{"id":"g1"}', mimeType: 'application/json' } : null,
          },
        },
      },
      {
        point: extensionPoints.mcpPrompt,
        key: 'growth.review',
        value: {
          pluginId,
          localId: 'review',
          name: 'growth.review',
          provider: {
            description: 'Review a goal',
            get: async () => ({ messages: [{ role: 'user', content: { type: 'text', text: 'review' } }] }),
          },
        },
      },
    ],
  };
}

test('unified registry namespaces tools, resources and prompts, then unregisters them', async () => {
  const registry = new ExtensionRegistry();
  attachMainExtensions(registry);
  registry.registerBatch('growth', dummyMain('growth').registrations);

  assert.equal(findAgentTool('growth.searchGoals')?.name, 'growth.searchGoals');
  assert.equal((await listMcpResources())[0]?.uri, 'tn://growth/goals/g1');
  assert.equal(listResourceTemplates()[0]?.uriTemplate, 'tn://growth/goals/{id}');
  assert.equal((await getMcpPrompt('growth.review', {}))?.messages[0]?.content.text, 'review');

  assert.throws(
    () => registry.registerBatch('other', [{ point: extensionPoints.mcpTool, key: 'growth.searchGoals', value: dummyTool('growth.searchGoals') }]),
    /重复注册扩展/,
  );

  registry.unregisterOwner('growth');
  assert.equal(findAgentTool('growth.searchGoals'), undefined);
  assert.deepEqual(await listMcpResources(), []);
  assert.deepEqual(listAgentTools(), []);
  attachMainExtensions(null);
});
