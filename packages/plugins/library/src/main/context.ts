import type { PluginWorkflowPort } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

let workflowPort: PluginWorkflowPort | null = null;

export function bindLibraryContext(workflow: PluginWorkflowPort) {
  workflowPort = workflow;
}

export async function recordLibraryActivity(input: { title: string; entityId: string; label?: string }) {
  try {
    await workflowPort?.emit('bookmarkCreated', { title: input.title, label: input.label }, {
      uri: pluginResourceUri('library', 'bookmarks', input.entityId),
      revision: '0',
    });
  } catch {
    // supplementary
  }
}

export async function unlinkLibraryEntity(entityId: string) {
  try {
    await workflowPort?.emit('bookmarkDeleted', { entityId }, {
      uri: pluginResourceUri('library', 'bookmarks', entityId),
      revision: '0',
    });
  } catch {
    // supplementary
  }
}
