import type { BrowserBoundsVo } from '@true-north/vo';

export const EMPTY_BROWSER_BOUNDS: BrowserBoundsVo = { x: 0, y: 0, width: 0, height: 0 };

/** Keep the native view inside the stage so it cannot paint over the 1px workbench chrome. */
export const NATIVE_BROWSER_CHROME_INSET = 1;

export function boundsAreValid(bounds: Pick<BrowserBoundsVo, 'width' | 'height'>): boolean {
  return bounds.width > 0 && bounds.height > 0;
}

export function snapNativeBrowserBounds(bounds: BrowserBoundsVo): BrowserBoundsVo {
  if (!boundsAreValid(bounds)) {
    return {
      x: Math.max(0, Math.round(bounds.x) || 0),
      y: Math.max(0, Math.round(bounds.y) || 0),
      width: Math.max(0, Math.round(bounds.width) || 0),
      height: Math.max(0, Math.round(bounds.height) || 0),
    };
  }
  const x = Math.ceil(bounds.x) + NATIVE_BROWSER_CHROME_INSET;
  const y = Math.ceil(bounds.y) + NATIVE_BROWSER_CHROME_INSET;
  return {
    x,
    y,
    width: Math.max(0, Math.floor(bounds.x + bounds.width) - x - NATIVE_BROWSER_CHROME_INSET),
    height: Math.max(0, Math.floor(bounds.y + bounds.height) - y - NATIVE_BROWSER_CHROME_INSET),
  };
}

export function isBrowserPhysicallyVisible(input: {
  visible: boolean;
  hasActiveUrl: boolean;
  boundsValid: boolean;
  occluded: boolean;
}): boolean {
  return input.visible && input.hasActiveUrl && input.boundsValid && !input.occluded;
}
