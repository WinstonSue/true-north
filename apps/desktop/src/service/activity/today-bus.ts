import { BrowserWindow } from 'electron';
import { ACTIVITY_TODAY_INVALIDATE_EVENT } from '@true-north/plugin-sdk';

export function emitTodayInvalidate(): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(ACTIVITY_TODAY_INVALIDATE_EVENT);
  }
}
