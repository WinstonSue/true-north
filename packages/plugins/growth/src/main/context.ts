import type { PluginNotifyPort, PluginWorkflowPort, AiCachePort, PluginMainContext } from '@true-north/plugin-sdk';
import { pluginResourceUri } from '@true-north/plugin-contract';

const PLUGIN_ID = 'growth';

let workflowPort: PluginWorkflowPort | null = null;
let cachePort: AiCachePort | null = null;
let notifyPort: PluginNotifyPort | null = null;
let hourTimer: ReturnType<typeof setInterval> | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

export function bindGrowthContext(ctx: PluginMainContext) {
  workflowPort = ctx.workflow;
  cachePort = ctx.cache;
  notifyPort = ctx.notify;
}

export function growthCache(): AiCachePort {
  if (!cachePort) throw new Error('Growth cache is not bound');
  return cachePort;
}

export async function emitGrowthEvent(
  localId: string,
  payload: Record<string, unknown>,
  source: { uri: string; revision: string },
  options?: { eventId?: string },
) {
  try {
    await workflowPort?.emit(localId, payload, source, options);
  } catch {
    // event log is supplementary
  }
}

function resourceOf(entityType: string, entityId: string) {
  return {
    uri: pluginResourceUri(PLUGIN_ID, `${entityType}s`, entityId),
    dedupeKey: `${entityType}:${entityId}`,
  };
}

export async function trackGrowthResource(input: { title: string; entityType: string; entityId: string }) {
  const { uri, dedupeKey } = resourceOf(input.entityType, input.entityId);
  try {
    await notifyPort?.post({ title: input.title, uri, dedupeKey, mode: 'remind' });
  } catch {
    // inbox is supplementary
  }
}

export async function untrackGrowthResource(entityType: string, entityId: string) {
  try {
    await notifyPort?.dismiss(`${entityType}:${entityId}`);
  } catch {
    // inbox is supplementary
  }
}

export function queueGrowthDueSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = undefined;
    void import('./due-notify')
      .then((mod) => mod.syncGrowthDueNotifications())
      .catch(() => {
        // inbox is supplementary
      });
  }, 50);
}

export function startGrowthDueWatch() {
  const tick = () => {
    queueGrowthDueSync();
  };
  tick();
  hourTimer = setInterval(tick, 60 * 1000);
}

export function stopGrowthDueWatch() {
  if (hourTimer) clearInterval(hourTimer);
  hourTimer = undefined;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = undefined;
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
  const source = {
    uri: pluginResourceUri(PLUGIN_ID, `${input.entityType}s`, input.entityId),
    revision: '1',
  };
  try {
    await workflowPort?.emit(
      `${input.entityType}Updated`,
      { title: input.title, summary: input.summary, label: input.label },
      source,
    );
  } catch {
    // event log is supplementary
  }
  queueGrowthDueSync();
}

export async function unlinkGrowthEntity(entityType: string, entityId: string) {
  const { uri } = resourceOf(entityType, entityId);
  try {
    await workflowPort?.emit(`${entityType}Deleted`, { entityId }, {
      uri,
      revision: '1',
    });
  } catch {
    // event log is supplementary
  }
  await untrackGrowthResource(entityType, entityId);
  queueGrowthDueSync();
}
