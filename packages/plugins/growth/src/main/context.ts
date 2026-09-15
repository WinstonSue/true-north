import type { ActivityPort, AiCachePort, PluginMainContext } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

const PLUGIN_ID = 'growth';

let activityPort: ActivityPort | null = null;
let cachePort: AiCachePort | null = null;

export function bindGrowthContext(ctx: PluginMainContext) {
  activityPort = ctx.activity;
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
    await activityPort?.record({
      title: input.title,
      summary: input.summary,
      source: input.source || 'domain',
      links: [
        {
          pluginId: PLUGIN_ID,
          entityType: input.entityType,
          entityId: input.entityId,
          uri: pluginResourceUri(PLUGIN_ID, `${input.entityType}s`, input.entityId),
          role: input.role,
          label: input.label,
        },
      ],
    });
  } catch {
    // activity card is supplementary
  }
}

export async function unlinkGrowthEntity(entityType: string, entityId: string) {
  try {
    await activityPort?.unlink({
      pluginId: PLUGIN_ID,
      entityType,
      entityId,
      uri: pluginResourceUri(PLUGIN_ID, `${entityType}s`, entityId),
    });
  } catch {
    // activity card is supplementary
  }
}

export function invalidateGrowthToday() {
  try {
    activityPort?.invalidateToday();
  } catch {
    // today badge is supplementary
  }
}
