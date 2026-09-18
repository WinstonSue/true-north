import assert from 'node:assert/strict';
import test from 'node:test';
import {
  activeNavState,
  compactNavItems,
  locationForNavChild,
  usesCompactNav,
  growthNavigation,
} from '../navigation.ts';

test('todo calendar maps to a page location', () => {
  const group = activeNavState({ view: 'todo', tab: 'calendar' });
  assert.equal(group.child?.nameKey, 'menu.todo.calendar');
  assert.deepEqual(locationForNavChild('todo', { tab: 'calendar', nameKey: 'menu.todo.calendar' }), {
    view: 'todo',
    tab: 'calendar',
  });
});

test('habit detail still highlights the list entry', () => {
  const state = activeNavState({ view: 'habit', tab: 'detail', id: 'h1' });
  assert.equal(state.group.view, 'habit');
  assert.equal(state.child?.nameKey, 'menu.habit.list');
});

test('goal mindmap keeps the page view key', () => {
  const state = activeNavState({ view: 'goal', tab: 'mindmap' });
  assert.equal(state.child?.tab, 'mindmap');
  assert.deepEqual(locationForNavChild('goal', { tab: 'tree', nameKey: 'menu.goal.tree' }), {
    view: 'goal',
  });
});

test('task detail keeps the task view and highlights today', () => {
  const state = activeNavState({ view: 'task', id: 't1' });
  assert.equal(state.group.view, 'task');
  assert.equal(state.child?.nameKey, 'menu.task.today');
});

test('workbench compact nav reuses the same private children as the page shell', () => {
  assert.equal(usesCompactNav('workbench'), true);
  assert.equal(usesCompactNav('page'), false);
  assert.deepEqual(
    growthNavigation.find((group) => group.view === 'todo')?.children.map((child) => child.tab),
    ['today', 'calendar', 'all'],
  );
  assert.deepEqual(
    compactNavItems('todo').map((item) => item.key),
    ['today', 'calendar', 'all'],
  );
});
