import { workflowStore } from './storage';
import { WorkflowDomainEvent, WorkflowEventResource, WorkflowPlan, WorkflowNode, WorkflowEdge } from './entities';

type LegacyActivity = {
  id: string;
  occurred_at?: string;
  occurredAt?: string;
  title?: string;
  summary?: string;
  source?: string;
};

type LegacyLink = {
  activity_id?: string;
  activityId?: string;
  plugin_id?: string;
  pluginId?: string;
  entity_type?: string;
  entityType?: string;
  entity_id?: string;
  entityId?: string;
  uri?: string;
  role?: string;
  label?: string;
};

export async function migrateLegacyActivity() {
  const store = workflowStore();
  const tables = (await store.query(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('activity', 'activity_link')",
  )) as Array<{ name: string }>;
  const names = new Set((tables || []).map((row) => row.name));
  if (!names.has('activity')) return { migrated: 0 };
  const marker = await store.getRepository(WorkflowDomainEvent).findOne({ where: { type: 'legacy.activity.recorded' } });
  if (marker) return { migrated: 0 };
  const activities = (await store.query('SELECT * FROM activity WHERE deleted_at IS NULL')) as LegacyActivity[];
  const links = names.has('activity_link')
    ? ((await store.query('SELECT * FROM activity_link WHERE deleted_at IS NULL')) as LegacyLink[])
    : [];
  const linksByActivity = new Map<string, LegacyLink[]>();
  for (const link of links) {
    const activityId = String(link.activity_id || link.activityId || '');
    const list = linksByActivity.get(activityId) || [];
    list.push(link);
    linksByActivity.set(activityId, list);
  }
  let migrated = 0;
  for (const activity of activities) {
    const event = await store.getRepository(WorkflowDomainEvent).save(
      store.getRepository(WorkflowDomainEvent).create({
        type: 'legacy.activity.recorded',
        occurredAt: new Date(activity.occurred_at || activity.occurredAt || Date.now()),
        payload: {
          title: activity.title,
          summary: activity.summary,
          source: activity.source,
          legacyActivityId: activity.id,
        },
        display: { title: activity.title, summary: activity.summary },
        schemaVersion: 1,
      }),
    );
    for (const link of linksByActivity.get(activity.id) || []) {
      const uri =
        link.uri ||
        (link.plugin_id || link.pluginId
          ? `tn://${link.plugin_id || link.pluginId}/${link.entity_type || link.entityType}s/${link.entity_id || link.entityId}`
          : undefined);
      if (!uri) continue;
      await store.getRepository(WorkflowEventResource).save(
        store.getRepository(WorkflowEventResource).create({
          eventId: event.id,
          uri,
          role: link.role || 'legacy',
        }),
      );
    }
    migrated += 1;
  }
  void WorkflowPlan;
  void WorkflowNode;
  void WorkflowEdge;
  return { migrated };
}
