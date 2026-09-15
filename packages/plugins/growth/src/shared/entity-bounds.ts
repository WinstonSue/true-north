export const GOAL_TYPE_VISION = 'vision';
export const GOAL_TYPE_RESULT = 'result';
export const GOAL_STATUS_TODO = 'todo';
export const GOAL_STATUS_DOING = 'doing';

export const GROWTH_RULE = {
  goalPriority: 'growth.goal.priority-inheritance',
  goalTime: 'growth.goal.time-inheritance',
  goalType: 'growth.goal.type-inheritance',
  taskBounds: 'growth.task.time-inheritance',
  taskSingleParent: 'growth.task.single-parent',
  habitGoalRequired: 'growth.habit.goal-required',
  todoRelated: 'growth.todo.related-inheritance',
} as const;

export class DomainRuleError extends Error {
  readonly ruleId: string;

  constructor(ruleId: string, message: string) {
    super(message);
    this.name = 'DomainRuleError';
    this.ruleId = ruleId;
  }
}

export type BoundParent = {
  startAt?: Date | string | null;
  endAt?: Date | string | null;
  importance?: number;
  difficulty?: number;
  type?: string;
  status?: string;
};

export type DecomposeBounds = {
  maxImportance?: number;
  maxDifficulty?: number;
  inheritImportance: number;
  inheritDifficulty: number;
  startAt?: string;
  endAt?: string;
  allowedChildGoalTypes?: string[];
  habitAllowed: boolean;
};

export type DecomposeDraft = {
  kind?: string;
  title?: string;
  planned?: string;
  importance?: number;
  difficulty?: number;
};

function toTime(value?: Date | string | null): number | undefined {
  if (value == null || value === '') return undefined;
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? undefined : time;
}

export function formatDateOnly(value?: Date | string | null): string | undefined {
  if (value == null || value === '') return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

export function isActiveGoalStatus(status?: string | null): boolean {
  return status === GOAL_STATUS_TODO || status === GOAL_STATUS_DOING;
}

export function allowedChildGoalTypes(parentType?: string): string[] {
  return parentType === GOAL_TYPE_RESULT ? [GOAL_TYPE_RESULT] : [GOAL_TYPE_VISION, GOAL_TYPE_RESULT];
}

export function assertChildDatesWithinParent(
  child: { startAt?: Date | string | null; endAt?: Date | string | null },
  parent: BoundParent,
  options: { ruleId: string; startMessage: string; endMessage: string },
): void {
  const parentStart = toTime(parent.startAt);
  const parentEnd = toTime(parent.endAt);
  const childStart = toTime(child.startAt);
  const childEnd = toTime(child.endAt);
  if (parentStart !== undefined && childStart !== undefined && childStart < parentStart) {
    throw new DomainRuleError(options.ruleId, options.startMessage);
  }
  if (parentEnd !== undefined && childEnd !== undefined && childEnd > parentEnd) {
    throw new DomainRuleError(options.ruleId, options.endMessage);
  }
}

export function assertPriorityWithinParent(
  child: { importance?: number; difficulty?: number },
  parent: BoundParent,
  options: { ruleId: string; importanceMessage: string; difficultyMessage: string },
): void {
  if (parent.importance !== undefined && child.importance !== undefined && child.importance > parent.importance) {
    throw new DomainRuleError(options.ruleId, options.importanceMessage);
  }
  if (parent.difficulty !== undefined && child.difficulty !== undefined && child.difficulty > parent.difficulty) {
    throw new DomainRuleError(options.ruleId, options.difficultyMessage);
  }
}

export function assertGoalTypeInheritance(parentType: string | undefined, childType: string | undefined): void {
  if (parentType === GOAL_TYPE_RESULT && childType !== GOAL_TYPE_RESULT) {
    throw new DomainRuleError(GROWTH_RULE.goalType, '指标目标只能包含指标子目标');
  }
}

export function assertSingleTaskParent(parentId?: string | null, goalId?: string | null): void {
  if (Boolean(parentId) === Boolean(goalId)) {
    throw new DomainRuleError(GROWTH_RULE.taskSingleParent, '任务必须且只能关联一个直接归属（目标或父任务）');
  }
}

export function assertHabitHasActiveGoal(goalIds?: string[], status?: string | null, goalName?: string): void {
  if (!goalIds?.length) {
    throw new DomainRuleError(GROWTH_RULE.habitGoalRequired, '习惯至少需要关联一个活跃目标');
  }
  if (status != null && !isActiveGoalStatus(status)) {
    const label = goalName ? `目标“${goalName}”` : '当前目标';
    throw new DomainRuleError(GROWTH_RULE.habitGoalRequired, `${label}不是活跃目标`);
  }
}

export function boundsFromParent(parent: BoundParent, scope: 'goal' | 'task'): DecomposeBounds {
  const inheritImportance = parent.importance ?? 3;
  const inheritDifficulty = parent.difficulty ?? 2;
  return {
    maxImportance: parent.importance,
    maxDifficulty: parent.difficulty,
    inheritImportance,
    inheritDifficulty,
    startAt: formatDateOnly(parent.startAt),
    endAt: formatDateOnly(parent.endAt),
    allowedChildGoalTypes: scope === 'goal' ? allowedChildGoalTypes(parent.type) : undefined,
    habitAllowed: scope === 'goal' ? isActiveGoalStatus(parent.status) : false,
  };
}

export function formatBoundsForPrompt(bounds: DecomposeBounds): string {
  const lines = ['Constraints:'];
  if (bounds.maxImportance !== undefined) {
    lines.push(`- child importance <= ${bounds.maxImportance} (omit to inherit ${bounds.inheritImportance})`);
  }
  if (bounds.maxDifficulty !== undefined) {
    lines.push(`- child difficulty <= ${bounds.maxDifficulty} (omit to inherit ${bounds.inheritDifficulty})`);
  }
  if (bounds.startAt || bounds.endAt) {
    lines.push(`- planned date within ${bounds.startAt || 'any'} .. ${bounds.endAt || 'any'}`);
  }
  if (bounds.allowedChildGoalTypes?.length) {
    lines.push(`- child goal type must be ${bounds.allowedChildGoalTypes.join(' or ')}`);
  }
  lines.push(bounds.habitAllowed ? '- habit may attach this goal (it is active)' : '- habit cannot attach this parent (goal must be active)');
  return lines.join('\n');
}

export function defaultPlannedDate(bounds: DecomposeBounds, now = Date.now()): string {
  const tomorrow = new Date(now + 86400000).toISOString().slice(0, 10);
  if (isDateWithinBounds(tomorrow, bounds)) return tomorrow;
  if (bounds.startAt && tomorrow < bounds.startAt) return bounds.startAt;
  if (bounds.endAt && tomorrow > bounds.endAt) return bounds.endAt;
  return tomorrow;
}

export function isDateWithinBounds(planned: string, bounds: DecomposeBounds): boolean {
  if (bounds.startAt && planned < bounds.startAt) return false;
  if (bounds.endAt && planned > bounds.endAt) return false;
  return true;
}

export function inheritDecomposeFields(draft: DecomposeDraft, bounds: DecomposeBounds): {
  importance: number;
  difficulty: number;
  planned: string;
} {
  const importance = draft.importance == null || !Number.isFinite(Number(draft.importance))
    ? bounds.inheritImportance
    : Math.min(5, Math.max(1, Math.round(Number(draft.importance))));
  const difficulty = draft.difficulty == null || !Number.isFinite(Number(draft.difficulty))
    ? bounds.inheritDifficulty
    : Math.min(5, Math.max(1, Math.round(Number(draft.difficulty))));
  const planned = draft.planned?.trim() || defaultPlannedDate(bounds);
  return { importance, difficulty, planned };
}

export function ruleRetryMessage(error: DomainRuleError): string {
  return `[${error.ruleId}] ${error.message}。请按规则修正后重试。`;
}

export function assertDraftAgainstBounds(
  draft: DecomposeDraft & { importance: number; difficulty: number; planned: string },
  bounds: DecomposeBounds,
  scope: 'goal' | 'task',
): void {
  const childLabel = draft.kind === 'goal' ? '子目标' : draft.kind === 'task' ? '任务' : draft.kind === 'habit' ? '习惯' : '待办';
  const priorityRule = scope === 'goal'
    ? (draft.kind === 'todo' ? GROWTH_RULE.todoRelated : GROWTH_RULE.goalPriority)
    : (draft.kind === 'todo' ? GROWTH_RULE.todoRelated : GROWTH_RULE.taskBounds);
  const timeRule = scope === 'goal'
    ? (draft.kind === 'todo' ? GROWTH_RULE.todoRelated : GROWTH_RULE.goalTime)
    : (draft.kind === 'todo' ? GROWTH_RULE.todoRelated : GROWTH_RULE.taskBounds);

  if (bounds.maxImportance !== undefined && draft.importance > bounds.maxImportance) {
    throw new DomainRuleError(priorityRule, `${childLabel}重要度不能高于上级（允许 1-${bounds.maxImportance}）`);
  }
  if (bounds.maxDifficulty !== undefined && draft.difficulty > bounds.maxDifficulty) {
    throw new DomainRuleError(priorityRule, `${childLabel}难度不能高于上级（允许 1-${bounds.maxDifficulty}）`);
  }
  if (!isDateWithinBounds(draft.planned, bounds)) {
    const range = `${bounds.startAt || '不限'} ~ ${bounds.endAt || '不限'}`;
    throw new DomainRuleError(timeRule, `${childLabel}计划日期必须位于上级范围内（${range}）`);
  }
  if (draft.kind === 'goal' && bounds.allowedChildGoalTypes?.length && !bounds.allowedChildGoalTypes.includes(GOAL_TYPE_RESULT)) {
    throw new DomainRuleError(GROWTH_RULE.goalType, '指标目标只能包含指标子目标');
  }
  if (draft.kind === 'habit') {
    if (scope !== 'goal') {
      throw new DomainRuleError(GROWTH_RULE.habitGoalRequired, '任务拆解不能创建习惯');
    }
    if (!bounds.habitAllowed) {
      throw new DomainRuleError(GROWTH_RULE.habitGoalRequired, '习惯必须关联活跃目标，当前目标不是活跃状态');
    }
  }
}
