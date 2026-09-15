import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DomainRuleError,
  GOAL_STATUS_DOING,
  GOAL_STATUS_TODO,
  GOAL_TYPE_RESULT,
  GOAL_TYPE_VISION,
  GROWTH_RULE,
  assertDraftAgainstBounds,
  assertGoalTypeInheritance,
  assertHabitHasActiveGoal,
  assertSingleTaskParent,
  boundsFromParent,
  inheritDecomposeFields,
} from '../../../../shared/entity-bounds.ts';

test('inherits parent importance instead of defaulting to 3', () => {
  const bounds = boundsFromParent(
    { importance: 2, difficulty: 1, status: GOAL_STATUS_TODO, type: GOAL_TYPE_VISION },
    'goal',
  );
  const inherited = inheritDecomposeFields({ kind: 'task', title: '拆解任务' }, bounds);
  assert.equal(inherited.importance, 2);
  assert.equal(inherited.difficulty, 1);
  assertDraftAgainstBounds({ kind: 'task', title: '拆解任务', ...inherited }, bounds, 'goal');
});

test('rejects task importance above associated goal', () => {
  const bounds = boundsFromParent({ importance: 2, difficulty: 4, status: GOAL_STATUS_TODO }, 'goal');
  const inherited = inheritDecomposeFields({ kind: 'task', title: '过重', importance: 3 }, bounds);
  assert.equal(inherited.importance, 3);
  assert.throws(
    () => assertDraftAgainstBounds({ kind: 'task', title: '过重', ...inherited }, bounds, 'goal'),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.goalPriority,
  );
});

test('rejects dates outside parent task range', () => {
  const bounds = boundsFromParent(
    { importance: 3, startAt: '2026-01-01', endAt: '2026-01-31', status: GOAL_STATUS_TODO },
    'task',
  );
  const inherited = inheritDecomposeFields({ kind: 'todo', title: '过期', planned: '2026-03-01' }, bounds);
  assert.throws(
    () => assertDraftAgainstBounds({ kind: 'todo', title: '过期', ...inherited }, bounds, 'task'),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.todoRelated,
  );
});

test('result goals cannot take vision children', () => {
  assert.throws(
    () => assertGoalTypeInheritance(GOAL_TYPE_RESULT, GOAL_TYPE_VISION),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.goalType,
  );
});

test('inactive goals cannot receive habits', () => {
  const bounds = boundsFromParent({ importance: 3, status: 'done', type: GOAL_TYPE_VISION }, 'goal');
  const inherited = inheritDecomposeFields({ kind: 'habit', title: '早起' }, bounds);
  assert.equal(bounds.habitAllowed, false);
  assert.throws(
    () => assertDraftAgainstBounds({ kind: 'habit', title: '早起', ...inherited }, bounds, 'goal'),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.habitGoalRequired,
  );
  assert.throws(() => assertHabitHasActiveGoal(['g1'], 'done', '旧目标'));
  assert.doesNotThrow(() => assertHabitHasActiveGoal(['g1'], GOAL_STATUS_DOING));
});

test('task must have exactly one parent', () => {
  assert.throws(
    () => assertSingleTaskParent('task-1', 'goal-1'),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.taskSingleParent,
  );
  assert.throws(() => assertSingleTaskParent(undefined, undefined));
  assert.doesNotThrow(() => assertSingleTaskParent('task-1', undefined));
});

test('stale cached importance is rejected after parent bound shrinks', () => {
  const generated = boundsFromParent({ importance: 3, status: GOAL_STATUS_TODO }, 'goal');
  const normalized = inheritDecomposeFields({ kind: 'task', title: '基线' }, generated);
  assert.equal(normalized.importance, 3);
  const latest = boundsFromParent({ importance: 1, status: GOAL_STATUS_TODO }, 'goal');
  assert.throws(
    () => assertDraftAgainstBounds({ kind: 'task', title: '基线', ...normalized }, latest, 'goal'),
    (error: unknown) => error instanceof DomainRuleError && error.ruleId === GROWTH_RULE.goalPriority,
  );
});

test('explicit overflow keeps the numeric value so generation can retry', () => {
  const bounds = boundsFromParent({ importance: 2, difficulty: 2, status: GOAL_STATUS_TODO }, 'goal');
  const inherited = inheritDecomposeFields({ kind: 'task', title: '完成基线测试', importance: 3 }, bounds);
  assert.equal(inherited.importance, 3);
  assert.throws(
    () => assertDraftAgainstBounds({ kind: 'task', title: '完成基线测试', ...inherited }, bounds, 'goal'),
    (error: unknown) =>
      error instanceof DomainRuleError &&
      error.ruleId === GROWTH_RULE.goalPriority &&
      error.message.includes('1-2'),
  );
});
