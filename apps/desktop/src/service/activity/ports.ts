import type {
  ActivityPort,
  CreateActivityInput,
  CaptureAdopter,
  TodaySectionSnapshot,
} from '@true-north/plugin-sdk';
import type { ActivityEntityRef } from '@true-north/plugin-sdk';
import { activityService } from './activity.service';
import { emitTodayInvalidate } from './today-bus';

const activityPort: ActivityPort = {
  record: async (input: CreateActivityInput) => {
    await activityService.create({
      title: input.title,
      summary: input.summary,
      source: input.source as never,
      occurredAt: input.occurredAt,
      captureMessageId: input.captureMessageId,
      links: input.links.map((link) => ({
        pluginId: link.pluginId,
        entityType: link.entityType,
        entityId: link.entityId,
        role: link.role,
            label: link.label,
            uri: link.uri,
          })),
    });
  },
  unlink: async (ref) => {
    await activityService.unlinkRef(ref);
  },
  invalidateToday: () => {
    emitTodayInvalidate();
  },
};

export function getActivityPort(): ActivityPort {
  return activityPort;
}

export async function unlinkRef(ref: ActivityEntityRef) {
  return activityPort.unlink(ref);
}

export function bindCaptureAdopters(adopters: CaptureAdopter[]) {
  activityService.configureCaptureAdopters(adopters);
}

export function bindTodayContributions(
  contributions: Array<{ collect: () => Promise<TodaySectionSnapshot> }>,
) {
  activityService.configureToday(contributions);
}
