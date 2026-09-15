export type OverlayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type OverlayHit = {
  id: string;
  rect: OverlayRect;
};

export function boundsAreValid(bounds: { width: number; height: number }): boolean {
  return bounds.width > 0 && bounds.height > 0;
}

export function isBrowserPhysicallyVisible(input: {
  visible: boolean;
  hasActiveUrl: boolean;
  boundsValid: boolean;
  occluded: boolean;
}): boolean {
  return input.visible && input.hasActiveUrl && input.boundsValid && !input.occluded;
}

export function getOverlappingRectangleCenterPoint(
  rect1: OverlayRect,
  rect2: OverlayRect,
): { x: number; y: number } | null {
  const overlapLeft = Math.max(rect1.left, rect2.left);
  const overlapRight = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
  const overlapTop = Math.max(rect1.top, rect2.top);
  const overlapBottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
  if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
    return {
      x: (overlapLeft + overlapRight) / 2,
      y: (overlapTop + overlapBottom) / 2,
    };
  }
  return null;
}

export function rectsOverlap(rect1: OverlayRect, rect2: OverlayRect): boolean {
  return Boolean(getOverlappingRectangleCenterPoint(rect1, rect2));
}

export function resolveOverlappingOverlayIds(input: {
  stageRect: OverlayRect;
  overlays: OverlayHit[];
  ancestorOfStage?: (id: string) => boolean;
}): string[] {
  const overlapping: string[] = [];
  for (const overlay of input.overlays) {
    if (input.ancestorOfStage?.(overlay.id)) continue;
    if (!rectsOverlap(input.stageRect, overlay.rect)) continue;
    overlapping.push(overlay.id);
  }
  return overlapping;
}
