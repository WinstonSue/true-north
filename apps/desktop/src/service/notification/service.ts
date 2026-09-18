import { IsNull } from 'typeorm';
import type { PluginNotifyInput } from '@true-north/plugin-sdk';
import { HostNotification } from './entity';
import { HostNotificationMute } from './mute';
import { notificationStore } from './storage';
import { broadcastNotificationInvalidate } from './broadcast';
import { sortInbox } from './inbox';
import { decidePostAction, notifyModeOf } from './remind';

export type HostNotifyInput = PluginNotifyInput & {
  pluginId?: string;
  hostAction?: string;
};

export type NotificationVo = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  uri?: string;
  hostAction?: string;
  pluginId?: string;
  dedupeKey?: string;
  readAt?: string | null;
  createdAt: string;
};

function toVo(row: HostNotification): NotificationVo {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    href: row.href,
    uri: row.uri,
    hostAction: row.hostAction,
    pluginId: row.pluginId,
    dedupeKey: row.dedupeKey,
    readAt: row.readAt ? new Date(row.readAt).toISOString() : null,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

export { sortInbox } from './inbox';

export class NotificationService {
  private repo() {
    return notificationStore().getRepository(HostNotification);
  }

  private muteRepo() {
    return notificationStore().getRepository(HostNotificationMute);
  }

  private async isMuted(dedupeKey?: string) {
    if (!dedupeKey) return false;
    const row = await this.muteRepo().findOneBy({ dedupeKey });
    return Boolean(row);
  }

  async post(input: HostNotifyInput) {
    const title = input.title.trim();
    if (!title) return null;
    const mode = notifyModeOf(input.mode);
    if (input.dedupeKey) {
      const muted = await this.isMuted(input.dedupeKey);
      const matches = await this.repo().find({
        where: { dedupeKey: input.dedupeKey },
        order: { createdAt: 'DESC' },
      });
      const existing = matches[0];
      const action = decidePostAction({
        mode,
        muted,
        hasUnread: matches.some((row) => !row.readAt),
        hasExisting: Boolean(existing),
      });
      if (action === 'skip') return existing || null;
      if (action === 'upsert' && existing) {
        existing.title = title;
        existing.body = input.body;
        existing.href = input.href;
        existing.uri = input.uri;
        existing.hostAction = input.hostAction;
        existing.pluginId = input.pluginId;
        await this.repo().save(existing);
        broadcastNotificationInvalidate();
        return existing;
      }
    }
    const row = this.repo().create({
      title,
      body: input.body,
      href: input.href,
      uri: input.uri,
      hostAction: input.hostAction,
      pluginId: input.pluginId,
      dedupeKey: input.dedupeKey,
    });
    await this.repo().save(row);
    broadcastNotificationInvalidate();
    return row;
  }

  async list() {
    const rows = await this.repo().find({
      order: { createdAt: 'DESC' },
      take: 80,
    });
    const list = sortInbox(rows.map(toVo));
    return { list, unreadCount: list.filter((item) => !item.readAt).length };
  }

  async markRead(id: string) {
    const row = await this.repo().findOneBy({ id });
    if (!row) return null;
    if (!row.readAt) {
      row.readAt = new Date();
      await this.repo().save(row);
      broadcastNotificationInvalidate();
    }
    return toVo(row);
  }

  async markReadByDedupeKey(dedupeKey: string) {
    const rows = await this.repo().find({ where: { dedupeKey, readAt: IsNull() } });
    if (!rows.length) return;
    const now = new Date();
    for (const row of rows) row.readAt = now;
    await this.repo().save(rows);
    broadcastNotificationInvalidate();
  }

  async ignore(id: string) {
    const row = await this.repo().findOneBy({ id });
    if (!row) return null;
    if (!row.readAt) row.readAt = new Date();
    await this.repo().save(row);
    if (row.dedupeKey) {
      const existing = await this.muteRepo().findOneBy({ dedupeKey: row.dedupeKey });
      if (!existing) {
        await this.muteRepo().save(
          this.muteRepo().create({ dedupeKey: row.dedupeKey, mutedAt: new Date() }),
        );
      }
    }
    broadcastNotificationInvalidate();
    return toVo(row);
  }

  async markAllRead() {
    const rows = await this.repo().find({ where: { readAt: IsNull() } });
    if (!rows.length) return { unreadCount: 0 };
    const now = new Date();
    for (const row of rows) row.readAt = now;
    await this.repo().save(rows);
    broadcastNotificationInvalidate();
    return { unreadCount: 0 };
  }
}

export const notificationService = new NotificationService();
