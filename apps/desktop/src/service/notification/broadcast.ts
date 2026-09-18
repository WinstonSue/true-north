import { BrowserWindow } from 'electron';
import { HOST_NOTIFICATION_INVALIDATE_EVENT } from '@true-north/plugin-sdk';

export function broadcastNotificationInvalidate() {
  try {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send(HOST_NOTIFICATION_INVALIDATE_EVENT);
    }
  } catch {
    // unit tests and non-electron hosts have no renderer
  }
}
