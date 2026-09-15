import { randomUUID } from 'node:crypto';
import { session, WebContentsView, type BaseWindow, type WebContents } from 'electron';
import type {
  BrowserBoundsVo,
  BrowserExtractResultVo,
  BrowserScreenshotVo,
  BrowserStateVo,
  BrowserTabVo,
} from '@true-north/vo';
import {
  BROWSER_STATE_CHANNEL,
  EMBEDDED_BROWSER_PARTITION,
  NEW_TAB_TITLE,
  isAllowedBrowserUrl,
  normalizeBrowserUrl,
} from '@true-north/vo';
import { extractFromContents } from '../extract';
import {
  EMPTY_BROWSER_BOUNDS,
  boundsAreValid,
  isBrowserPhysicallyVisible,
  snapNativeBrowserBounds,
} from './browser-visibility';

type SendFn = (channel: string, payload: BrowserStateVo) => void;

type HostAttach = {
  window: BaseWindow;
  send: SendFn;
  hostContents?: WebContents | null;
};

type TabRecord = {
  id: string;
  title: string;
  url: string;
  loading: boolean;
  view: WebContentsView | null;
};

const VIEW_PREFERENCES = {
  sandbox: true,
  nodeIntegration: false,
  contextIsolation: true,
  webSecurity: true,
  partition: EMBEDDED_BROWSER_PARTITION,
};

const SCREENSHOT_RETRIES = 5;

function roundBounds(bounds: BrowserBoundsVo): BrowserBoundsVo {
  return snapNativeBrowserBounds(bounds);
}

function navigationFlags(contents: WebContents | undefined): { canGoBack: boolean; canGoForward: boolean } {
  if (!contents || contents.isDestroyed()) return { canGoBack: false, canGoForward: false };
  const history = contents.navigationHistory;
  if (history) {
    return { canGoBack: history.canGoBack(), canGoForward: history.canGoForward() };
  }
  return { canGoBack: false, canGoForward: false };
}

function canSetVisible(view: WebContentsView): boolean {
  return typeof (view as WebContentsView & { setVisible?: (next: boolean) => void }).setVisible === 'function';
}

function nativeVisible(view: WebContentsView): boolean {
  const readable = view as WebContentsView & { getVisible?: () => boolean };
  return typeof readable.getVisible === 'function' ? Boolean(readable.getVisible()) : true;
}

function setNativeVisible(view: WebContentsView, visible: boolean): void {
  const writable = view as WebContentsView & { setVisible?: (next: boolean) => void };
  writable.setVisible?.(visible);
}

const OFFSCREEN_BOUNDS: BrowserBoundsVo = { x: -10000, y: -10000, width: 1, height: 1 };

export class EmbeddedBrowserHost {
  private window: BaseWindow | null = null;
  private send: SendFn | null = null;
  private hostContents: WebContents | null = null;
  private visible = false;
  private occluded = false;
  private activeTabId: string | null = null;
  private tabs: TabRecord[] = [];
  private bounds: BrowserBoundsVo = EMPTY_BROWSER_BOUNDS;
  private attached = new Set<WebContentsView>();
  private sessionGuarded = false;
  private resizeBound = false;

  attach(options: HostAttach): void {
    this.detach();
    this.window = options.window;
    this.send = options.send;
    this.hostContents = options.hostContents ?? null;
    if (!this.resizeBound) {
      this.window.on('resize', () => this.syncViews());
      this.resizeBound = true;
    }
    this.installSessionGuards();
    this.emitState();
  }

  detach(): void {
    for (const tab of this.tabs) {
      this.destroyView(tab);
    }
    this.tabs = [];
    this.activeTabId = null;
    this.visible = false;
    this.occluded = false;
    this.bounds = EMPTY_BROWSER_BOUNDS;
    this.attached.clear();
    this.window = null;
    this.send = null;
    this.hostContents = null;
    this.resizeBound = false;
  }

  getState(): BrowserStateVo {
    return {
      visible: this.visible,
      activeTabId: this.activeTabId,
      tabs: this.tabs.map((tab) => this.toTabVo(tab)),
    };
  }

  setVisible(visible: boolean): BrowserStateVo {
    this.visible = visible;
    if (!visible) this.occluded = false;
    this.syncViews();
    return this.emitState();
  }

  setOccluded(occluded: boolean): BrowserStateVo {
    this.occluded = occluded;
    this.syncViews();
    return this.getState();
  }

  setBounds(bounds: BrowserBoundsVo): BrowserStateVo {
    this.bounds = roundBounds(bounds);
    this.syncViews();
    return this.getState();
  }

  createTab(url?: string): BrowserStateVo {
    const tab = this.createTabInternal();
    if (url) {
      this.navigateTab(tab.id, url);
      return this.getState();
    }
    this.syncViews();
    return this.emitState();
  }

  closeTab(tabId: string): BrowserStateVo {
    const index = this.tabs.findIndex((tab) => tab.id === tabId);
    if (index < 0) return this.getState();
    const [removed] = this.tabs.splice(index, 1);
    if (removed) this.destroyView(removed);
    if (this.tabs.length === 0) {
      this.activeTabId = null;
    } else if (this.activeTabId === tabId) {
      const next = this.tabs[Math.min(index, this.tabs.length - 1)];
      this.activeTabId = next?.id ?? null;
    }
    this.syncViews();
    return this.emitState();
  }

  activateTab(tabId: string): BrowserStateVo {
    if (!this.tabs.some((tab) => tab.id === tabId)) return this.getState();
    this.activeTabId = tabId;
    this.syncViews();
    return this.emitState();
  }

  navigate(tabId: string, rawUrl: string): BrowserStateVo {
    this.navigateTab(tabId, rawUrl);
    return this.getState();
  }

  goBack(tabId: string): BrowserStateVo {
    const tab = this.requireTab(tabId);
    const contents = tab.view?.webContents;
    if (contents && !contents.isDestroyed() && navigationFlags(contents).canGoBack) {
      contents.navigationHistory.goBack();
    }
    return this.emitState();
  }

  goForward(tabId: string): BrowserStateVo {
    const tab = this.requireTab(tabId);
    const contents = tab.view?.webContents;
    if (contents && !contents.isDestroyed() && navigationFlags(contents).canGoForward) {
      contents.navigationHistory.goForward();
    }
    return this.emitState();
  }

  reload(tabId: string): BrowserStateVo {
    const tab = this.requireTab(tabId);
    const contents = tab.view?.webContents;
    if (contents && !contents.isDestroyed() && tab.url) {
      tab.loading = true;
      contents.reload();
    }
    return this.emitState();
  }

  async extractTab(tabId: string): Promise<BrowserExtractResultVo> {
    const tab = this.requireTab(tabId);
    const contents = tab.view?.webContents;
    const url = contents && !contents.isDestroyed() ? contents.getURL() || tab.url : tab.url;
    if (!url) throw new Error('当前标签没有打开的页面');
    if (!contents || contents.isDestroyed()) throw new Error('当前标签没有可抽取的页面');
    return extractFromContents(contents, url);
  }

  async captureScreenshot(tabId: string): Promise<BrowserScreenshotVo> {
    const tab = this.requireTab(tabId);
    const view = tab.view;
    const contents = view?.webContents;
    const url = contents && !contents.isDestroyed() ? contents.getURL() || tab.url : tab.url;
    if (!url || !view || !contents || contents.isDestroyed()) {
      return { tabId, url: url || '', mimeType: 'image/png', dataUrl: null };
    }
    const wasVisible = nativeVisible(view);
    if (!wasVisible) {
      setNativeVisible(view, true);
      setNativeVisible(view, false);
    }
    let lastError: Error | undefined;
    for (let attempt = 0; attempt < SCREENSHOT_RETRIES; attempt += 1) {
      try {
        const image = await contents.capturePage(undefined, { stayHidden: true });
        if (!wasVisible) setNativeVisible(view, false);
        else if (nativeVisible(view) !== true) setNativeVisible(view, true);
        const dataUrl = `data:image/png;base64,${image.toPNG().toString('base64')}`;
        return { tabId, url, mimeType: 'image/png', dataUrl };
      } catch (error) {
        if (error instanceof Error && error.message === 'UnknownVizError') {
          lastError = error;
          await new Promise((resolve) => setTimeout(resolve, 16));
          continue;
        }
        if (!wasVisible) setNativeVisible(view, false);
        throw error;
      }
    }
    if (!wasVisible) setNativeVisible(view, false);
    throw lastError || new Error(`Failed to capture screenshot after ${SCREENSHOT_RETRIES} attempts`);
  }

  private createTabInternal(): TabRecord {
    const tab: TabRecord = {
      id: randomUUID(),
      title: NEW_TAB_TITLE,
      url: '',
      loading: false,
      view: null,
    };
    this.tabs.push(tab);
    this.activeTabId = tab.id;
    return tab;
  }

  private requireTab(tabId: string): TabRecord {
    const tab = this.tabs.find((item) => item.id === tabId);
    if (!tab) throw new Error('标签不存在');
    return tab;
  }

  private navigateTab(tabId: string, rawUrl: string): void {
    const url = normalizeBrowserUrl(rawUrl);
    if (!url) throw new Error('不是有效网址');
    const tab = this.requireTab(tabId);
    this.activeTabId = tabId;
    tab.url = url;
    tab.title = url;
    tab.loading = true;
    const view = this.ensureView(tab);
    this.syncViews();
    this.emitState();
    void view.webContents.loadURL(url).catch((error) => {
      console.error('内嵌浏览器打开失败', error);
      tab.loading = false;
      this.emitState();
    });
  }

  private ensureView(tab: TabRecord): WebContentsView {
    if (tab.view && !tab.view.webContents.isDestroyed()) return tab.view;
    const view = new WebContentsView({ webPreferences: VIEW_PREFERENCES });
    this.bindContents(tab.id, view.webContents);
    tab.view = view;
    setNativeVisible(view, false);
    return view;
  }

  private bindContents(tabId: string, contents: WebContents): void {
    contents.setWindowOpenHandler((details) => {
      if (isAllowedBrowserUrl(details.url)) {
        this.createTab(details.url);
      }
      return { action: 'deny' };
    });
    contents.on('will-navigate', (event, url) => {
      if (!isAllowedBrowserUrl(url)) event.preventDefault();
    });
    contents.on('will-redirect', (event, url) => {
      if (!isAllowedBrowserUrl(url)) event.preventDefault();
    });
    contents.on('page-title-updated', (_event, title) => {
      const tab = this.tabs.find((item) => item.id === tabId);
      if (!tab) return;
      tab.title = title.trim() || tab.url || NEW_TAB_TITLE;
      this.emitState();
    });
    contents.on('did-navigate', (_event, url) => {
      this.syncNavigation(tabId, url);
    });
    contents.on('did-navigate-in-page', (_event, url) => {
      this.syncNavigation(tabId, url);
    });
    contents.on('did-start-loading', () => {
      const tab = this.tabs.find((item) => item.id === tabId);
      if (!tab) return;
      tab.loading = true;
      this.emitState();
    });
    contents.on('did-stop-loading', () => {
      const tab = this.tabs.find((item) => item.id === tabId);
      if (!tab) return;
      tab.loading = false;
      this.emitState();
    });
    contents.on('did-fail-load', (_event, _code, _desc, _url, isMainFrame) => {
      if (!isMainFrame) return;
      const tab = this.tabs.find((item) => item.id === tabId);
      if (!tab) return;
      tab.loading = false;
      this.emitState();
    });
  }

  private syncNavigation(tabId: string, url: string): void {
    const tab = this.tabs.find((item) => item.id === tabId);
    if (!tab || !isAllowedBrowserUrl(url)) return;
    tab.url = url;
    if (!tab.title || tab.title === NEW_TAB_TITLE) tab.title = url;
    this.emitState();
  }

  private syncViews(): void {
    const active = this.tabs.find((tab) => tab.id === this.activeTabId);
    const showActive = isBrowserPhysicallyVisible({
      visible: this.visible,
      hasActiveUrl: Boolean(active?.url && active.view),
      boundsValid: boundsAreValid(this.bounds),
      occluded: this.occluded,
    });
    for (const tab of this.tabs) {
      if (!tab.view) continue;
      const show = showActive && tab.id === this.activeTabId;
      if (show) this.showView(tab.view);
      else this.hideView(tab.view, { detach: false });
    }
  }

  private showView(view: WebContentsView): void {
    if (!this.window || this.window.isDestroyed()) return;
    this.attachView(view);
    view.setBounds(this.bounds);
    setNativeVisible(view, true);
  }

  private hideView(view: WebContentsView, options?: { detach?: boolean }): void {
    if (view.webContents.isFocused()) {
      const host = this.hostContents;
      if (host && !host.isDestroyed()) host.focus();
    }
    setNativeVisible(view, false);
    if (options?.detach) {
      if (this.attached.has(view) && this.window && !this.window.isDestroyed()) {
        this.window.contentView.removeChildView(view);
      }
      this.attached.delete(view);
      view.setBounds(EMPTY_BROWSER_BOUNDS);
      return;
    }
    if (!canSetVisible(view)) {
      view.setBounds({
        ...OFFSCREEN_BOUNDS,
        width: Math.max(1, this.bounds.width),
        height: Math.max(1, this.bounds.height),
      });
      return;
    }
    if (this.attached.has(view)) view.setBounds(this.bounds);
  }

  private attachView(view: WebContentsView): void {
    if (!this.window || this.window.isDestroyed()) return;
    if (this.attached.has(view)) return;
    this.window.contentView.addChildView(view);
    this.attached.add(view);
  }

  private destroyView(tab: TabRecord): void {
    const view = tab.view;
    tab.view = null;
    if (!view) return;
    this.hideView(view, { detach: true });
    const contents = view.webContents;
    if (!contents.isDestroyed()) contents.close();
  }

  private installSessionGuards(): void {
    if (this.sessionGuarded) return;
    const ses = session.fromPartition(EMBEDDED_BROWSER_PARTITION);
    ses.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    ses.setPermissionCheckHandler(() => false);
    this.sessionGuarded = true;
  }

  private toTabVo(tab: TabRecord): BrowserTabVo {
    const flags = navigationFlags(tab.view?.webContents);
    return {
      id: tab.id,
      title: tab.title,
      url: tab.url,
      loading: tab.loading,
      canGoBack: flags.canGoBack,
      canGoForward: flags.canGoForward,
    };
  }

  private emitState(): BrowserStateVo {
    const state = this.getState();
    this.send?.(BROWSER_STATE_CHANNEL, state);
    return state;
  }
}

export const embeddedBrowserHost = new EmbeddedBrowserHost();
