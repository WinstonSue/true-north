import { Body, Controller, Get, Put } from '@true-north/plugin-sdk/main';
import type { GrowthNotifySettings } from '@true-north/vo';
import { getGrowthNotifySettings, saveGrowthNotifySettings } from './notify-settings.service';
import { queueGrowthDueSync } from './context';

@Controller('/notify')
export class NotifySettingsController {
  @Get('/settings', { description: '成长通知默认规则' })
  async get() {
    return getGrowthNotifySettings();
  }

  @Put('/settings', { description: '保存成长通知默认规则' })
  async put(@Body() body: GrowthNotifySettings) {
    const saved = await saveGrowthNotifySettings(body);
    queueGrowthDueSync();
    return saved;
  }
}
