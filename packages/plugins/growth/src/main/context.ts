import type { PluginWorkflowPort, AiCachePort, PluginMainContext } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

const PLUGIN_ID = 'growth';

let workflowPort: PluginWorkflowPort | null = null;
let cachePort: AiCachePort | null = null;

export function bindGrowthContext(ctx: PluginMainContext) {
  workflowPort = ctx.workflow;
  cachePort = ctx.cache;
}

export function growthCache(): AiCachePort {
  if (!cachePort) throw new Error('Growth cache is not bound');
  return cachePort;
}

export async function recordGrowthActivity(input: {
  title: string;
  summary?: string;
  source?: string;
  entityType: string;
  entityId: string;
  role?: string;
  label?: string;
}) {
  try {
    await workflowPort?.emit(
      `${input.entityType}Updated`,
      { title: input.title, summary: input.summary, label: input.label },
      {
        uri: pluginResourceUri(PLUGIN_ID, `${input.entityType}s`, input.entityId),
        revision: '1',
      },
    );
  } catch {
    // event log is supplementary
  }
}

export async function unlinkGrowthEntity(entityType: string, entityId: string) {
  try {
    await workflowPort?.emit(`${entityType}Deleted`, { entityId }, {
      uri: pluginResourceUri(PLUGIN_ID, `${entityType}s`, entityId),
      revision: '1',
    });
  } catch {
    // event log is supplementary
  }
}
