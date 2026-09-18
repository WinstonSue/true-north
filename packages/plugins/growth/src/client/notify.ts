import type { GrowthNotifySettings } from '@true-north/vo';
import { pluginIpc } from './port';

export default class NotifyController {
  static async getSettings() {
    return pluginIpc().get<GrowthNotifySettings>('/notify/settings');
  }

  static async putSettings(body: GrowthNotifySettings) {
    return pluginIpc().put<GrowthNotifySettings>('/notify/settings', body);
  }
}
