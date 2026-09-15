import { request } from '../request';
import type {
  BrowserBoundsVo,
  BrowserExtractResultVo,
  BrowserNavigateRequestVo,
  BrowserOccludedRequestVo,
  BrowserScreenshotVo,
  BrowserStateVo,
  BrowserVisibleRequestVo,
} from '@true-north/vo';

export default class BrowserController {
  static async getState() {
    return request<BrowserStateVo>({ method: 'get' })('/browser/state');
  }

  static async setVisible(body: BrowserVisibleRequestVo) {
    return request<BrowserStateVo>({ method: 'put' })('/browser/visible', body);
  }

  static async setBounds(body: BrowserBoundsVo) {
    return request<BrowserStateVo>({ method: 'put' })('/browser/bounds', body);
  }

  static async setOccluded(body: BrowserOccludedRequestVo) {
    return request<BrowserStateVo>({ method: 'put' })('/browser/occluded', body);
  }

  static async createTab(url?: string) {
    return request<BrowserStateVo>({ method: 'post' })('/browser/tabs', url ? { url } : {});
  }

  static async closeTab(id: string) {
    return request<BrowserStateVo>({ method: 'remove' })(`/browser/tabs/${id}`);
  }

  static async activateTab(id: string) {
    return request<BrowserStateVo>({ method: 'put' })(`/browser/tabs/${id}/activate`, { tabId: id });
  }

  static async navigate(id: string, body: BrowserNavigateRequestVo) {
    return request<BrowserStateVo>({ method: 'post' })(`/browser/tabs/${id}/navigate`, body);
  }

  static async goBack(id: string) {
    return request<BrowserStateVo>({ method: 'post' })(`/browser/tabs/${id}/back`);
  }

  static async goForward(id: string) {
    return request<BrowserStateVo>({ method: 'post' })(`/browser/tabs/${id}/forward`);
  }

  static async reload(id: string) {
    return request<BrowserStateVo>({ method: 'post' })(`/browser/tabs/${id}/reload`);
  }

  static async extractTab(id: string) {
    return request<BrowserExtractResultVo>({ method: 'post' })(`/browser/tabs/${id}/extract`);
  }

  static async captureScreenshot(id: string) {
    return request<BrowserScreenshotVo>({ method: 'post' })(`/browser/tabs/${id}/screenshot`);
  }
}
