import { randomUUID } from 'crypto';
import { contributionKey, parsePluginResourceUri, type ResourceRef } from '@true-north/plugin-contract';
import { workflowStore } from './storage';
import { WorkflowDomainEvent, WorkflowEventResource } from './entities';

const delivered = new Set<string>();

export type EmitEventInput = {
  pluginId: string;
  localId: string;
  payload?: Record<string, unknown>;
  source?: ResourceRef;
  causationId?: string;
  correlationId?: string;
  display?: Record<string, unknown>;
  eventId?: string;
};

function sanitizeDisplay(input?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!input) return undefined;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const lower = key.toLowerCase();
    if (/(secret|token|password|card|cvv|credential)/.test(lower)) continue;
    if (typeof value === 'string' && value.length > 400) {
      next[key] = `${value.slice(0, 400)}…`;
    } else {
      next[key] = value;
    }
  }
  return next;
}

export class WorkflowEventService {
  async emit(input: EmitEventInput): Promise<WorkflowDomainEvent> {
    const id = input.eventId || randomUUID();
    if (delivered.has(id)) {
      const existing = await workflowStore().getRepository(WorkflowDomainEvent).findOneBy({ id });
      if (existing) return existing;
    }
    const type = contributionKey(input.pluginId, input.localId);
    const repo = workflowStore().getRepository(WorkflowDomainEvent);
    const duplicate = await repo.findOneBy({ id });
    if (duplicate) {
      delivered.add(id);
      return duplicate;
    }
    const entity = repo.create({
      id,
      type,
      sourceUri: input.source?.uri,
      occurredAt: new Date(),
      causationId: input.causationId,
      correlationId: input.correlationId,
      payload: input.payload || {},
      revisionAfter: input.source?.revision,
      schemaVersion: 1,
      display: sanitizeDisplay(input.display || input.payload),
    });
    const saved = await repo.save(entity);
    if (input.source?.uri) {
      const linkRepo = workflowStore().getRepository(WorkflowEventResource);
      await linkRepo.save(
        linkRepo.create({
          eventId: saved.id,
          uri: input.source.uri,
          role: 'source',
        }),
      );
    }
    delivered.add(id);
    return saved;
  }

  async list(filter?: { pluginId?: string; keyword?: string; from?: string; to?: string; uri?: string }) {
    const qb = workflowStore()
      .getRepository(WorkflowDomainEvent)
      .createQueryBuilder('event')
      .orderBy('event.occurredAt', 'DESC');
    if (filter?.pluginId) {
      qb.andWhere('event.type LIKE :prefix', { prefix: `${filter.pluginId}.%` });
    }
    if (filter?.keyword?.trim()) {
      qb.andWhere('(event.type LIKE :kw OR event.payload LIKE :kw OR event.display LIKE :kw)', {
        kw: `%${filter.keyword.trim()}%`,
      });
    }
    if (filter?.from) qb.andWhere('event.occurredAt >= :from', { from: filter.from });
    if (filter?.to) qb.andWhere('event.occurredAt <= :to', { to: filter.to });
    if (filter?.uri) {
      qb.innerJoin(WorkflowEventResource, 'link', 'link.eventId = event.id').andWhere('link.uri = :uri', {
        uri: filter.uri,
      });
    }
    const events = await qb.getMany();
    return events.map((event) => ({
      id: event.id,
      type: event.type,
      sourceUri: event.sourceUri,
      occurredAt: event.occurredAt instanceof Date ? event.occurredAt.toISOString() : String(event.occurredAt),
      payload: event.payload,
      revisionAfter: event.revisionAfter,
      display: event.display,
      pluginId: parsePluginResourceUri(event.sourceUri || '')?.pluginId || event.type.split('.')[0],
    }));
  }
}

export const workflowEventService = new WorkflowEventService();
