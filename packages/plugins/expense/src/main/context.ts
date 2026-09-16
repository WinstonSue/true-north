import type { PluginWorkflowPort } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

let workflowPort: PluginWorkflowPort | null = null;

export function bindExpenseContext(workflow: PluginWorkflowPort) {
  workflowPort = workflow;
}

export async function recordExpenseActivity(input: {
  title: string;
  entityId: string;
  label?: string;
}) {
  try {
    await workflowPort?.emit('transactionBooked', { title: input.title, label: input.label }, {
      uri: pluginResourceUri('expense', 'transactions', input.entityId),
      revision: '0',
    });
  } catch {
    // supplementary
  }
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
}
