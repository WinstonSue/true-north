import type { WorkbenchToolDefinition } from '@true-north/plugin-sdk';
import { growthIds } from '../../../contract';
import { SuggestTodoWorkspace } from './SuggestTodoWorkspace';

export const suggestTodoTool: WorkbenchToolDefinition = {
  workspaceKey: growthIds.workspaces.suggestTodo,
  title: (payload) => String(payload.title || '待办建议'),
  entryLabel: (payload) => `打开工作台：${payload.title || '待办建议'}`,
  autoOpen: ({ force, message }) => {
    if (force) return true;
    const parts = (message as { parts?: Array<{ type?: string; toolName?: string; status?: string }> })?.parts || [];
    return parts.some((part) => part.type === 'tool' && String(part.toolName || '').endsWith('suggestTodo') && part.status === 'done');
  },
  parsePayload: (payload) => payload,
  Component: SuggestTodoWorkspace,
};
