import { rectsOverlap, type OverlayRect } from './overlay-geometry';

export type BrowserOverlayType =
  | 'menu'
  | 'quickInput'
  | 'hover'
  | 'dialog'
  | 'notification'
  | 'unknown';

const OVERLAY_DEFINITIONS: ReadonlyArray<{ className: string; type: BrowserOverlayType }> = [
  { className: 'sue-modal-wrap', type: 'dialog' },
  { className: 'sue-modal-root', type: 'dialog' },
  { className: 'sue-modal-mask', type: 'dialog' },
  { className: 'sue-drawer', type: 'dialog' },
  { className: 'sue-drawer-content-wrapper', type: 'dialog' },
  { className: 'sue-drawer-mask', type: 'dialog' },
  { className: 'sue-image-preview-root', type: 'dialog' },
  { className: 'sue-dropdown', type: 'menu' },
  { className: 'sue-select-dropdown', type: 'menu' },
  { className: 'sue-cascader-dropdown', type: 'menu' },
  { className: 'sue-picker-dropdown', type: 'menu' },
  { className: 'sue-popover', type: 'hover' },
  { className: 'sue-tooltip', type: 'hover' },
  { className: 'sue-notification', type: 'notification' },
  { className: 'sue-message', type: 'notification' },
];

const CUSTOM_OVERLAY_ATTR = 'data-native-overlay';

function toRect(element: HTMLElement): OverlayRect {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

function isVisibleOverlay(element: HTMLElement): boolean {
  if (element.hidden) return false;
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!style) return true;
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export class BrowserOverlayManager {
  private readonly structuralObserver: MutationObserver;
  private readonly overlayCollections = new Map<string, { type: BrowserOverlayType; collection: HTMLCollectionOf<Element> }>();
  private readonly elementObservers = new WeakMap<HTMLElement, MutationObserver>();
  private readonly overlayRectangles = new WeakMap<HTMLElement, OverlayRect>();
  private listeners = new Set<() => void>();
  private observing = false;

  constructor(private readonly targetWindow: Window) {
    const Observer = (targetWindow as unknown as typeof globalThis).MutationObserver;
    this.structuralObserver = new Observer(() => this.updateTrackedElements(true));
    for (const definition of OVERLAY_DEFINITIONS) {
      this.overlayCollections.set(definition.className, {
        type: definition.type,
        collection: this.targetWindow.document.getElementsByClassName(definition.className),
      });
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    if (!this.observing) {
      this.observing = true;
      this.structuralObserver.observe(this.targetWindow.document.body, { childList: true, subtree: true });
      this.updateTrackedElements();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.stop();
    };
  }

  getOverlappingOverlays(stage: HTMLElement): Array<{ type: BrowserOverlayType; rect: OverlayRect }> {
    const stageRect = toRect(stage);
    const overlapping: Array<{ type: BrowserOverlayType; rect: OverlayRect }> = [];
    for (const overlay of this.overlays()) {
      if (overlay.element.contains(stage) || stage.contains(overlay.element)) continue;
      if (!isVisibleOverlay(overlay.element)) continue;
      const overlayRect = this.getRect(overlay.element);
      if (!rectsOverlap(stageRect, overlayRect)) continue;
      overlapping.push({ type: overlay.type, rect: overlayRect });
    }
    return overlapping;
  }

  dispose(): void {
    this.stop();
  }

  private *overlays(): Iterable<{ element: HTMLElement; type: BrowserOverlayType }> {
    for (const entry of this.overlayCollections.values()) {
      for (const element of entry.collection) {
        yield { element: element as HTMLElement, type: entry.type };
      }
    }
    const custom = this.targetWindow.document.querySelectorAll(`[${CUSTOM_OVERLAY_ATTR}]`);
    for (const element of custom) {
      yield { element: element as HTMLElement, type: 'unknown' };
    }
  }

  private getRect(element: HTMLElement): OverlayRect {
    const cached = this.overlayRectangles.get(element);
    if (cached) return cached;
    const rect = toRect(element);
    this.overlayRectangles.set(element, rect);
    return rect;
  }

  private updateTrackedElements(shouldEmit = false): void {
    for (const overlay of this.overlays()) {
      if (this.elementObservers.has(overlay.element)) continue;
      const Observer = (this.targetWindow as unknown as typeof globalThis).MutationObserver;
      const observer = new Observer(() => {
        this.overlayRectangles.delete(overlay.element);
        this.emit();
      });
      observer.observe(overlay.element, {
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden', CUSTOM_OVERLAY_ATTR],
        childList: true,
        subtree: true,
      });
      this.elementObservers.set(overlay.element, observer);
      shouldEmit = true;
    }
    if (shouldEmit) this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  private stop(): void {
    this.observing = false;
    this.structuralObserver.disconnect();
    for (const overlay of this.overlays()) {
      this.elementObservers.get(overlay.element)?.disconnect();
    }
  }
}
