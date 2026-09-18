import { getPluginHost } from '../../plugin/active-host';
import { HOST_NOTIFICATION_STORE_ID } from '../../plugin/host-ids';

export function notificationStore() {
  return getPluginHost().storage.get(HOST_NOTIFICATION_STORE_ID);
}
