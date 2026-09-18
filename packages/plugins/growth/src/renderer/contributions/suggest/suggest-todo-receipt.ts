import type { CommandResult } from '@true-north/plugin-sdk';
import { parsePluginResourceUri } from '@true-north/plugin-sdk';
import type { TodoFormData } from '../../../client';
import { toHm } from '../../domains/todo/detail/planTime.ts';
import { normalizeSuggestTodoPayload } from '../../../shared/normalize-suggest-todo.ts';

export type SuggestPayload = Record<string, unknown> & {
  title?: string;
  name?: string;
  planned?: string;
  planDate?: string;
  plannedTime?: string;
  planStartTime?: string;
  planEndTime?: string;
  note?: string;
  description?: string;
  importance?: number;
  urgency?: number;
  adopted?: boolean;
  workflowDefinitionId?: string;
  resource?: { uri?: string; revision?: string };
};

export function initialFormFromPayload(
  payload: SuggestPayload,
  workflowDefinitionId?: string,
): Partial<TodoFormData> {
  const normalized = normalizeSuggestTodoPayload(payload);
  const plannedTime = toHm(normalized.plannedTime);
  return {
    name: normalized.title,
    planDate: normalized.planned,
    description: normalized.note,
    planTimeRange: plannedTime ? [plannedTime, plannedTime] : undefined,
    workflowDefinitionId,
  };
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function receiptFormFromPayload(payload: SuggestPayload): Partial<TodoFormData> {
  const workflowDefinitionId =
    typeof payload.workflowDefinitionId === 'string' ? payload.workflowDefinitionId : undefined;
  const base = initialFormFromPayload(payload, workflowDefinitionId);
  const start = toHm(typeof payload.planStartTime === 'string' ? payload.planStartTime : undefined);
  const end = toHm(typeof payload.planEndTime === 'string' ? payload.planEndTime : undefined) || start;
  const importance = optionalNumber(payload.importance);
  const urgency = optionalNumber(payload.urgency);
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const description =
    typeof payload.description === 'string' ? payload.description.trim() : '';
  return {
    ...base,
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(start ? { planTimeRange: [start, end] as [string, string] } : {}),
    ...(importance != null ? { importance } : {}),
    ...(urgency != null ? { urgency } : {}),
  };
}

export function todoIdFromUri(uri?: string): string {
  if (!uri) return '';
  const parsed = parsePluginResourceUri(uri);
  if (parsed?.pluginId !== 'growth' || parsed.collection !== 'todos' || !parsed.id) return '';
  return parsed.id;
}

export function createdTodoIdFromResult(result: CommandResult): string {
  if ('output' in result && result.output && typeof result.output === 'object') {
    const id = (result.output as { id?: unknown }).id;
    if (typeof id === 'string' && id) return id;
  }
  if ('resource' in result) return todoIdFromUri(result.resource?.uri);
  return '';
}

export function createdTodoIdFromPayload(payload: SuggestPayload): string {
  return todoIdFromUri(payload.resource?.uri);
}
