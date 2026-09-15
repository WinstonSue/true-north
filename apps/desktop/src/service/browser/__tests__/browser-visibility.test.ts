import assert from 'node:assert/strict';
import test from 'node:test';
import { boundsAreValid, isBrowserPhysicallyVisible, NATIVE_BROWSER_CHROME_INSET, snapNativeBrowserBounds } from '../browser-visibility.ts';

test('occlusion never shows the native view even when the panel is open', () => {
  assert.equal(
    isBrowserPhysicallyVisible({
      visible: true,
      hasActiveUrl: true,
      boundsValid: true,
      occluded: true,
    }),
    false,
  );
  assert.equal(boundsAreValid({ width: 12, height: 0 }), false);
});

test('bounds updates during occlusion stay hidden until occlusion clears', () => {
  const next = {
    visible: true,
    hasActiveUrl: true,
    boundsValid: boundsAreValid({ width: 520, height: 800 }),
    occluded: true,
  };
  assert.equal(isBrowserPhysicallyVisible(next), false);
  assert.equal(isBrowserPhysicallyVisible({ ...next, occluded: false }), true);
});

test('native bounds sit inside the stage so they cannot cover workbench chrome', () => {
  const stage = { x: 800, y: 80, width: 400, height: 600 };
  const snapped = snapNativeBrowserBounds(stage);
  assert.deepEqual(snapped, {
    x: 801,
    y: 81,
    width: 398,
    height: 598,
  });
  assert.equal(snapped.width, stage.width - NATIVE_BROWSER_CHROME_INSET * 2);
  assert.equal(snapped.height, stage.height - NATIVE_BROWSER_CHROME_INSET * 2);
  const fractional = snapNativeBrowserBounds({ x: 800.4, y: 80.4, width: 400.4, height: 600.4 });
  assert.equal(fractional.x >= 802, true);
  assert.equal(fractional.y >= 82, true);
  assert.equal(fractional.x + fractional.width <= 800.4 + 400.4 - 1, true);
  assert.equal(fractional.y + fractional.height <= 80.4 + 600.4 - 1, true);
  assert.deepEqual(snapNativeBrowserBounds({ x: 0, y: 0, width: 0, height: 0 }), {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
});
