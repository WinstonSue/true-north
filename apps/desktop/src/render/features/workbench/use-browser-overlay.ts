import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserService } from '@true-north/web-service';
import { BrowserOverlayManager } from './browser-overlay-manager';
import { useWorkbench } from './context';

export function useBrowserOverlay(stage: HTMLElement | null, enabled: boolean) {
  const { activeWebTab, reportBounds } = useWorkbench();
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [occluded, setOccluded] = useState(false);
  const screenshotKey = useRef('');
  const captureGen = useRef(0);
  const occludedRef = useRef(false);
  const screenshotRef = useRef<string | null>(null);
  const pendingHideRef = useRef(false);

  useEffect(() => {
    screenshotRef.current = screenshot;
  }, [screenshot]);

  useLayoutEffect(() => {
    if (!pendingHideRef.current) return;
    pendingHideRef.current = false;
    void BrowserService.setOccluded(true);
  }, [screenshot]);

  useEffect(() => {
    occludedRef.current = occluded;
  }, [occluded]);

  useEffect(() => {
    if (!enabled || !activeWebTab?.url) {
      captureGen.current += 1;
      setScreenshot(null);
      screenshotKey.current = '';
      if (occludedRef.current) {
        occludedRef.current = false;
        setOccluded(false);
        void BrowserService.setOccluded(false);
      }
      return undefined;
    }

    const tabId = activeWebTab.id;
    const url = activeWebTab.url;
    const key = `${tabId}:${url}`;
    if (screenshotKey.current !== key) {
      screenshotKey.current = key;
      setScreenshot(null);
    }

    let cancelled = false;
    const gen = ++captureGen.current;
    void BrowserService.captureScreenshot(tabId)
      .then((result) => {
        if (cancelled || gen !== captureGen.current) return;
        if (result.tabId !== tabId || result.url !== url) return;
        if (result.dataUrl) setScreenshot(result.dataUrl);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [activeWebTab?.id, activeWebTab?.loading, activeWebTab?.url, enabled]);

  useEffect(() => {
    if (!enabled || !stage) return undefined;

    const manager = new BrowserOverlayManager(window);
    let frame = 0;
    const publish = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const overlapping = manager.getOverlappingOverlays(stage).length > 0;
        if (overlapping === occludedRef.current) return;
        occludedRef.current = overlapping;
        setOccluded(overlapping);
        if (overlapping) {
          const tabId = activeWebTab?.id;
          const expectedUrl = activeWebTab?.url;
          const hideNow = () => {
            pendingHideRef.current = false;
            void BrowserService.setOccluded(true);
          };
          if (tabId && expectedUrl) {
            void BrowserService.captureScreenshot(tabId)
              .then((result) => {
                if (!occludedRef.current) return;
                if (result.tabId !== tabId || result.url !== expectedUrl) return;
                if (result.dataUrl && result.dataUrl !== screenshotRef.current) {
                  pendingHideRef.current = true;
                  setScreenshot(result.dataUrl);
                  return;
                }
                hideNow();
              })
              .catch(() => hideNow());
          } else {
            hideNow();
          }
          return;
        }
        const rect = stage.getBoundingClientRect();
        reportBounds({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        void BrowserService.setOccluded(false);
      });
    };

    const stop = manager.subscribe(publish);
    const resizeObserver = new ResizeObserver(publish);
    resizeObserver.observe(stage);
    publish();
    window.addEventListener('resize', publish);
    window.addEventListener('scroll', publish, true);
    return () => {
      stop();
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', publish);
      window.removeEventListener('scroll', publish, true);
      manager.dispose();
      occludedRef.current = false;
      setOccluded(false);
      void BrowserService.setOccluded(false);
    };
  }, [activeWebTab?.id, activeWebTab?.url, enabled, reportBounds, stage]);

  return { screenshot, occluded };
}

