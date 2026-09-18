import type { PluginMainContext, PluginWorkflowPort } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

let workflowPort: PluginWorkflowPort | null = null;

export function bindInventoryContext(ctx: PluginMainContext) {
  workflowPort = ctx.workflow;
}

export async function recordInventoryActivity(
  localId: string,
  input: { title: string; entityId: string; collection: 'items' | 'locations' | 'movements' },
) {
  const uri = pluginResourceUri('inventory', input.collection, input.entityId);
  try {
    await workflowPort?.emit(
      localId,
      { title: input.title },
      {
        uri,
        revision: '0',
      },
    );
  } catch {
    // supplementary
  }
}
