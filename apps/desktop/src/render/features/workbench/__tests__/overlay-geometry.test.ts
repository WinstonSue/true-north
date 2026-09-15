import assert from 'node:assert/strict';
import test from 'node:test';
import {
  boundsAreValid,
  getOverlappingRectangleCenterPoint,
  isBrowserPhysicallyVisible,
  resolveOverlappingOverlayIds,
} from '../overlay-geometry.ts';

test('physical visibility requires an open panel, a page, valid bounds and no occlusion', () => {
  assert.equal(
    isBrowserPhysicallyVisible({ visible: true, hasActiveUrl: true, boundsValid: true, occluded: false }),
    true,
  );
  assert.equal(
    isBrowserPhysicallyVisible({ visible: true, hasActiveUrl: true, boundsValid: true, occluded: true }),
    false,
  );
  assert.equal(
    isBrowserPhysicallyVisible({ visible: false, hasActiveUrl: true, boundsValid: true, occluded: false }),
    false,
  );
  assert.equal(
    isBrowserPhysicallyVisible({ visible: true, hasActiveUrl: false, boundsValid: true, occluded: false }),
    false,
  );
  assert.equal(boundsAreValid({ width: 0, height: 400 }), false);
  assert.equal(boundsAreValid({ width: 480, height: 640 }), true);
});

test('edge overlap hides the native view while disjoint menus do not', () => {
  const stage = { left: 800, top: 80, width: 400, height: 600 };
  assert.deepEqual(
    getOverlappingRectangleCenterPoint(stage, { left: 1180, top: 100, width: 80, height: 40 }),
    { x: 1190, y: 120 },
  );
  const ids = resolveOverlappingOverlayIds({
    stageRect: stage,
    overlays: [
      { id: 'menu', rect: { left: 100, top: 100, width: 200, height: 40 } },
      { id: 'edge', rect: { left: 1180, top: 100, width: 80, height: 40 } },
    ],
  });
  assert.deepEqual(ids, ['edge']);
});

test('wide drawer overlapping the right half of the stage still occludes', () => {
  const stage = { left: 800, top: 80, width: 400, height: 600 };
  const ids = resolveOverlappingOverlayIds({
    stageRect: stage,
    overlays: [{ id: 'drawer-mask', rect: { left: 200, top: 0, width: 900, height: 800 } }],
  });
  assert.deepEqual(ids, ['drawer-mask']);
});

test('select overlapping the stage occludes even when hit testing would miss', () => {
  const stage = { left: 800, top: 80, width: 400, height: 600 };
  const ids = resolveOverlappingOverlayIds({
    stageRect: stage,
    overlays: [{ id: 'select', rect: { left: 820, top: 120, width: 220, height: 280 } }],
  });
  assert.deepEqual(ids, ['select']);
});

test('closing nested overlays only restores when the last intersecting overlay is gone', () => {
  const stage = { left: 800, top: 80, width: 400, height: 600 };
  const drawer = { id: 'drawer', rect: { left: 500, top: 0, width: 720, height: 800 } };
  const confirm = { id: 'confirm', rect: { left: 620, top: 180, width: 360, height: 220 } };
  assert.deepEqual(
    resolveOverlappingOverlayIds({ stageRect: stage, overlays: [drawer, confirm] }),
    ['drawer', 'confirm'],
  );
  assert.deepEqual(
    resolveOverlappingOverlayIds({ stageRect: stage, overlays: [drawer] }),
    ['drawer'],
  );
  assert.deepEqual(resolveOverlappingOverlayIds({ stageRect: stage, overlays: [] }), []);
});
