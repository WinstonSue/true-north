import type { GrowthNotifySettings } from '@true-north/vo';
import { DEFAULT_GROWTH_NOTIFY_SETTINGS } from './notify-slots';
import { store } from './storage';
import { GrowthNotifySettingsEntity } from './notify-settings.entity';
import { settingsOf } from './notify-slots';

export async function getGrowthNotifySettings(): Promise<GrowthNotifySettings> {
  const repo = store().getRepository(GrowthNotifySettingsEntity);
  const row = (await repo.find({ take: 1 }))[0] as GrowthNotifySettingsEntity | undefined;
  if (!row) return DEFAULT_GROWTH_NOTIFY_SETTINGS;
  return settingsOf(row.payload);
}

export async function saveGrowthNotifySettings(input: GrowthNotifySettings): Promise<GrowthNotifySettings> {
  const payload = settingsOf(input);
  const repo = store().getRepository(GrowthNotifySettingsEntity);
  const existing = (await repo.find({ take: 1 }))[0] as GrowthNotifySettingsEntity | undefined;
  if (existing) {
    existing.payload = payload;
    await repo.save(existing);
    return payload;
  }
  await repo.save(repo.create({ payload }));
  return payload;
}
