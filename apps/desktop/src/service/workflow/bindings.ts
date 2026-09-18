import type { WorkflowBinding } from '@true-north/plugin-contract';

export type BindingContext = {
  event: { payload?: Record<string, unknown> };
  nodes: Record<string, { input?: unknown; output?: unknown }>;
};

function readPath(root: unknown, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  let current: unknown = root;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function writePath(root: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.').filter(Boolean);
  if (!parts.length) return;
  let current: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]!;
    const next = current[key];
    if (!next || typeof next !== 'object' || Array.isArray(next)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]!] = value;
}

function contextRoot(ctx: BindingContext): Record<string, unknown> {
  return { event: ctx.event, nodes: ctx.nodes };
}

/** 把指向该节点的 binding 收成 input 对象。`to` 形如 `confirm.input.title` 或 `nodes.confirm.input`. */
export function boundInputFor(nodeKey: string, bindings: WorkflowBinding[], ctx: BindingContext): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  const prefixes = [`${nodeKey}.input`, `nodes.${nodeKey}.input`, nodeKey];
  for (const binding of bindings) {
    const to = binding.to.startsWith('nodes.') ? binding.to.slice('nodes.'.length) : binding.to;
    const matches = prefixes.some((prefix) => to === prefix || to.startsWith(`${prefix}.`));
    if (!matches) continue;
    const value = readPath(contextRoot(ctx), binding.from);
    if (to === `${nodeKey}.input` || to === nodeKey) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(input, value as Record<string, unknown>);
      }
      continue;
    }
    const rest = to.startsWith(`${nodeKey}.input.`)
      ? to.slice(`${nodeKey}.input.`.length)
      : to.startsWith(`${nodeKey}.`)
        ? to.slice(`${nodeKey}.`.length).replace(/^input\./, '')
        : to;
    if (rest) writePath(input, rest, value);
  }
  return input;
}

export function withNodeOutput(ctx: BindingContext, nodeKey: string, output: unknown): BindingContext {
  return {
    event: ctx.event,
    nodes: {
      ...ctx.nodes,
      [nodeKey]: { ...ctx.nodes[nodeKey], output },
    },
  };
}
