import dayjs from 'dayjs';

const DEFAULT_PLAN_TIME = '09:00';
const RELATED_TYPES = new Set(['none', 'goal', 'habit', 'task', 'repeat', 'is-repeat']);

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function toHm(value?: string): string | undefined {
  if (!value) return undefined;
  const [hour, minute] = value.split(':');
  if (hour === undefined || minute === undefined) return undefined;
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

export type TodoCommandCreateInput = {
  name: string;
  description?: string;
  planDate: string;
  planStartTime?: string;
  planEndTime?: string;
  status: 'todo';
  importance?: number;
  urgency?: number;
  repeatConfig?: Record<string, unknown>;
  notifyRule?: unknown;
  relatedType?: string;
  relatedId?: string;
  taskId?: string;
  habitId?: string;
};

export function createTodoVoFromCommandInput(body: Record<string, unknown>): TodoCommandCreateInput {
  const planDate = String(body.planDate || body.planned || dayjs().format('YYYY-MM-DD'));
  let planStartTime = toHm(optionalString(body.planStartTime));
  let planEndTime = toHm(optionalString(body.planEndTime)) || planStartTime;
  if (Array.isArray(body.planTimeRange)) {
    planStartTime = toHm(optionalString(body.planTimeRange[0])) || planStartTime;
    planEndTime = toHm(optionalString(body.planTimeRange[1])) || planStartTime;
  }
  const plannedTime = toHm(optionalString(body.plannedTime));
  if (plannedTime && !planStartTime) {
    planStartTime = plannedTime;
    planEndTime = plannedTime;
  }
  if (!planStartTime) {
    planStartTime = DEFAULT_PLAN_TIME;
    planEndTime = DEFAULT_PLAN_TIME;
  }
  const relatedType = optionalString(body.relatedType);
  return {
    name: String(body.name || body.title || ''),
    description: optionalString(body.description) || optionalString(body.note),
    planDate,
    planStartTime,
    planEndTime,
    status: 'todo',
    importance: optionalNumber(body.importance),
    urgency: optionalNumber(body.urgency),
    repeatConfig:
      body.repeatConfig && typeof body.repeatConfig === 'object' && !Array.isArray(body.repeatConfig)
        ? (body.repeatConfig as Record<string, unknown>)
        : undefined,
    notifyRule: body.notifyRule === null || (body.notifyRule && typeof body.notifyRule === 'object')
      ? body.notifyRule
      : undefined,
    relatedType: relatedType && RELATED_TYPES.has(relatedType) ? relatedType : undefined,
    relatedId: optionalString(body.relatedId),
    taskId: optionalString(body.taskId),
    habitId: optionalString(body.habitId),
  };
}
