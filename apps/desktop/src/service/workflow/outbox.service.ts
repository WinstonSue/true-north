import { drainOutbox, type OutboxRecord, type OutboxStore } from '@true-north/plugin-sdk/main';
import { workflowStore } from './storage';
import { WorkflowEventOutbox } from './entities';
import { workflowInstanceService } from './instance.service';

function toRecord(entity: WorkflowEventOutbox): OutboxRecord {
  return {
    id: entity.id,
    eventId: entity.eventId,
    type: entity.type,
    payload: entity.payload,
    sourceUri: entity.sourceUri,
    status: entity.status,
    attempts: entity.attempts,
  };
}

class WorkflowOutboxStore implements OutboxStore {
  private repo() {
    return workflowStore().getRepository(WorkflowEventOutbox);
  }

  async claimPending(limit: number): Promise<OutboxRecord[]> {
    const list = await this.repo().find({
      where: { status: 'pending' },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return list.map(toRecord);
  }

  async markProcessed(id: string) {
    const entity = await this.repo().findOneBy({ id });
    if (!entity) return;
    entity.status = 'processed';
    entity.processedAt = new Date();
    await this.repo().save(entity);
  }

  async markFailed(id: string, error: string) {
    const entity = await this.repo().findOneBy({ id });
    if (!entity) return;
    entity.attempts += 1;
    entity.lastError = error;
    entity.status = entity.attempts >= 8 ? 'failed' : 'pending';
    await this.repo().save(entity);
  }
}

const store = new WorkflowOutboxStore();
let draining = false;

export async function enqueueWorkflowEvent(event: {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  sourceUri?: string;
}) {
  const repo = workflowStore().getRepository(WorkflowEventOutbox);
  const existing = await repo.findOneBy({ eventId: event.id });
  if (existing) return;
  await repo.save(
    repo.create({
      eventId: event.id,
      type: event.type,
      payload: event.payload,
      sourceUri: event.sourceUri,
      status: 'pending',
    }),
  );
}

export async function processWorkflowOutbox() {
  if (draining) return;
  draining = true;
  try {
    await drainOutbox(store, async (record) => {
      await workflowInstanceService.startFromEvent({
        id: record.eventId,
        type: record.type,
        payload: record.payload,
        sourceUri: record.sourceUri,
      });
    });
  } finally {
    draining = false;
  }
}
