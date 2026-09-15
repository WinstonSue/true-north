import assert from 'node:assert/strict';
import test from 'node:test';
import {
  appendTabOrder,
  clearPluginViewTargetState,
  isWebTabId,
  needsFallbackWebTab,
  neighborId,
  pluginViewTabId,
  upsertPluginViewTab,
  withPluginViewTarget,
} from '../tab-state.ts';

test('plugin view tabs reuse a stable id and focus existing entries', () => {
  const viewId = 'growth.todo';
  const id = pluginViewTabId(viewId);
  assert.equal(id, 'plugin-view:growth.todo');

  const first = upsertPluginViewTab([], { id, title: '待办' });
  const focused = upsertPluginViewTab(first, { id, title: '待办事项' });
  assert.equal(focused.length, 1);
  assert.equal(focused[0]?.title, '待办事项');
  assert.deepEqual(appendTabOrder(['web-1'], id), ['web-1', id]);
  assert.deepEqual(appendTabOrder(['web-1', id], id), ['web-1', id]);
});

test('plugin view targets update in place and bump generation', () => {
  const id = pluginViewTabId('growth.goal');
  const opened = withPluginViewTarget(undefined, { id, title: '目标' }, { type: 'goal', id: 'g1' });
  assert.deepEqual(opened.target, { type: 'goal', id: 'g1' });
  assert.equal(opened.targetGeneration, 1);

  const switched = withPluginViewTarget(opened, { id, title: '目标' }, { type: 'goal', id: 'g2' });
  assert.deepEqual(switched.target, { type: 'goal', id: 'g2' });
  assert.equal(switched.targetGeneration, 2);

  const replayed = withPluginViewTarget(switched, { id, title: '目标' }, { type: 'goal', id: 'g2' });
  assert.deepEqual(replayed.target, { type: 'goal', id: 'g2' });
  assert.equal(replayed.targetGeneration, 3);

  const preserved = withPluginViewTarget(replayed, { id, title: '目标树' });
  assert.equal(preserved.title, '目标树');
  assert.deepEqual(preserved.target, { type: 'goal', id: 'g2' });
  assert.equal(preserved.targetGeneration, 3);

  const cleared = clearPluginViewTargetState(preserved);
  assert.equal(cleared.target, undefined);
  assert.equal(cleared.targetGeneration, 4);
  assert.equal(upsertPluginViewTab([replayed], switched).length, 1);
});

test('plugin views coexist with web and tool tabs and close to a neighbor', () => {
  const toolId = 'msg-1';
  const pluginId = pluginViewTabId('expense.transaction');
  const webId = 'web-1';
  const order = [webId, toolId, pluginId];
  const toolIds = new Set([toolId]);
  const pluginViewIds = new Set([pluginId]);

  assert.equal(isWebTabId(webId, toolIds, pluginViewIds), true);
  assert.equal(isWebTabId(toolId, toolIds, pluginViewIds), false);
  assert.equal(isWebTabId(pluginId, toolIds, pluginViewIds), false);
  assert.equal(neighborId(order, pluginId), toolId);
  assert.equal(needsFallbackWebTab(1, 1, 1), false);
});

test('closing the last plugin view with no other tabs needs a fallback web tab', () => {
  const pluginId = pluginViewTabId('library.search');
  assert.equal(neighborId([pluginId], pluginId), null);
  assert.equal(needsFallbackWebTab(0, 0, 0), true);
  assert.equal(needsFallbackWebTab(0, 1, 0), false);
});
