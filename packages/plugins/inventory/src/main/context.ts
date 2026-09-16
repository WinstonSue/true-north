import type { PluginWorkflowPort } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

let workflowPort: PluginWorkflowPort | null = null;

export function bindInventoryContext(workflow: PluginWorkflowPort) {
  workflowPort = workflow;
}

export async function recordInventoryActivity(
  localId: string,
  input: { title: string; entityId: string; collection: 'items' | 'locations' | 'movements' },
) {
  try {
    await workflowPort?.emit(
      localId,
      { title: input.title },
      {
        uri: pluginResourceUri('inventory', input.collection, input.entityId),
        revision: '0',
      },
    );
  } catch {
    // supplementary
  }
}
