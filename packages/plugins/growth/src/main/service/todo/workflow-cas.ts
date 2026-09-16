import { pluginResourceUri, type CommandResult } from '@true-north/plugin-contract';
import { revisionOf } from '@true-north/plugin-sdk';

export type TodoSnapshot = {
  id: string;
  name: string;
  status: string;
  revision?: number | null;
};

export function todoUri(id: string) {
  return pluginResourceUri('growth', 'todos', id);
}

export function parseTodoId(uri?: string) {
  const prefix = 'tn://growth/todos/';
  if (!uri?.startsWith(prefix)) return null;
  return uri.slice(prefix.length);
}

export function decideCompleteTodo(
  current: TodoSnapshot | null,
  input: { uri?: string; expectedRevision?: string },
): CommandResult | { proceed: true; id: string; actual: string } {
  const id = parseTodoId(input.uri);
  if (!id) return { status: 'rejected', code: 'validation', reason: 'missing todo uri' };
  if (!current) return { status: 'notFound', uri: input.uri };
  const actual = revisionOf(current.revision);
  if (input.expectedRevision && input.expectedRevision !== actual) {
    return {
      status: 'conflict',
      resource: { uri: todoUri(id), revision: actual },
      expectedRevision: input.expectedRevision,
      actualRevision: actual,
      current: { status: current.status, name: current.name },
      reason: 'revision mismatch',
    };
  }
  if (current.status === 'done') {
    return {
      status: 'noop',
      reason: 'alreadyApplied',
      resource: { uri: todoUri(id), revision: actual },
    };
  }
  if (current.status !== 'todo') {
    return {
      status: 'rejected',
      code: 'precondition',
      reason: `todo status is ${current.status}`,
    };
  }
  return { proceed: true, id, actual };
}
