import assert from 'node:assert/strict';
import test from 'node:test';
import { migrateMessageParts } from '../workspace-parts.ts';

test('legacy purchase workspaces become read-only archive text', () => {
  const parts = migrateMessageParts([
    { type: 'workspace', workspaceKey: 'growth.suggestTodo', payload: { title: '买米' } },
    { type: 'workspace', workspaceKey: 'purchase.suggestPurchase', payload: { title: '米' } },
  ]);
  assert.equal(parts[0]?.type, 'workspace');
  assert.equal(parts[1]?.type, 'text');
  if (parts[0]?.type === 'workspace') {
    assert.equal(parts[0].workspaceId, 'legacy-0');
  }
  if (parts[1]?.type === 'text') {
    assert.match(parts[1].text, /历史采购建议（只读归档）/);
    assert.match(parts[1].text, /米/);
  }
});

test('legacy capture workspaces become read-only archive text', () => {
  const parts = migrateMessageParts([
    {
      type: 'workspace',
      workspaceKey: 'activity.capture',
      payload: { suggestions: [{ title: '买米' }, { title: '记账' }] },
    },
  ]);
  assert.equal(parts[0]?.type, 'text');
  if (parts[0]?.type === 'text') {
    assert.match(parts[0].text, /只读归档/);
    assert.match(parts[0].text, /买米/);
  }
});
