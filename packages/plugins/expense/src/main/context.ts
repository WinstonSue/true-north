import type { PluginMainContext, PluginNotifyPort, PluginWorkflowPort } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';
import { statementMonthOf } from './month-statement';

let workflowPort: PluginWorkflowPort | null = null;
let notifyPort: PluginNotifyPort | null = null;
let hourTimer: ReturnType<typeof setInterval> | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let lastStatementMonth = '';

export function bindExpenseContext(ctx: PluginMainContext) {
  workflowPort = ctx.workflow;
  notifyPort = ctx.notify;
}

export async function recordExpenseActivity(input: {
  title: string;
  entityId: string;
  label?: string;
}) {
  const uri = pluginResourceUri('expense', 'transactions', input.entityId);
  try {
    await workflowPort?.emit('transactionBooked', { title: input.title, label: input.label }, {
      uri,
      revision: '0',
    });
  } catch {
    // supplementary
  }
  queueExpenseMonthSync();
}

export async function unlinkExpenseEntity(entityId: string) {
  try {
    await workflowPort?.emit('transactionDeleted', { entityId }, {
      uri: pluginResourceUri('expense', 'transactions', entityId),
      revision: '0',
    });
  } catch {
    // supplementary
  }
  queueExpenseMonthSync();
}

export async function postMonthStatement(input: { month: string; title: string; body: string }) {
  try {
    await notifyPort?.post({
      title: input.title,
      body: input.body,
      href: '/plugins/expense',
      dedupeKey: `month:${input.month}`,
    });
  } catch {
    // inbox is supplementary
  }
}

export function queueExpenseMonthSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = undefined;
    void import('./month-notify')
      .then((mod) => mod.syncExpenseMonthStatement())
      .catch(() => {
        // inbox is supplementary
      });
  }, 50);
}

export function startExpenseMonthWatch() {
  lastStatementMonth = '';
  const tick = () => {
    const month = statementMonthOf();
    if (month === lastStatementMonth) return;
    lastStatementMonth = month;
    queueExpenseMonthSync();
  };
  tick();
  hourTimer = setInterval(tick, 60 * 60 * 1000);
}

export function stopExpenseMonthWatch() {
  if (hourTimer) clearInterval(hourTimer);
  hourTimer = undefined;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = undefined;
}
