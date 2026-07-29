import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Check, Copy, Inspect, X, createElement, type IconNode } from 'lucide';
import type { ElementContext } from 'fe-selector/core';
import { resolveProductReference, type ProductRef, type ResolvedProductReference } from '../src/product-wiki';
import { inspectorMessage, type InspectorSelection, type InspectorSelector } from './protocol';
import './style.css';

type InspectorHandle = { destroy: () => void };

const ROOT_ID = 'prototype-inspector';
const FRAME_ID = 'prototype-frame';

export function bootstrapPrototypeInspector(): InspectorHandle {
  const root = document.getElementById(ROOT_ID);
  const frame = document.getElementById(FRAME_ID) as HTMLIFrameElement | null;
  if (!root || !frame) throw new Error(`#${ROOT_ID} and #${FRAME_ID} are required`);
  root.querySelectorAll('[data-prototype-inspector-ui]').forEach((element) => element.remove());

  const toolRail = document.createElement('div');
  toolRail.className = 'prototypeInspectorToolRail';
  toolRail.dataset.prototypeInspectorUi = 'true';
  const trigger = iconButton('检查页面元素', Inspect);
  trigger.className = 'prototypeInspectorTrigger';
  const panel = document.createElement('aside');
  panel.className = 'prototypeInspectorPanel';
  panel.dataset.prototypeInspectorUi = 'true';
  panel.setAttribute('aria-label', '元素信息面板');
  panel.hidden = true;
  toolRail.append(trigger);
  root.append(panel, toolRail);

  let frameReady = false;
  let selecting = false;
  let activeSelectionId: number | undefined;

  const sendToFrame = (message: unknown) => {
    if (!frameReady || !frame.contentWindow) return;
    frame.contentWindow.postMessage(message, window.location.origin);
  };
  const setSelecting = (next: boolean) => {
    selecting = next;
    if (next) trigger.setAttribute('aria-pressed', 'true');
    else trigger.removeAttribute('aria-pressed');
    root.classList.toggle('is-selecting', next);
    sendToFrame({ type: 'opt-ui:set-activation', payload: { alwaysOn: next } });
  };
  const setPanelOpen = (open: boolean) => {
    sendToFrame({ type: inspectorMessage.panel, payload: { open } });
  };
  const close = () => {
    activeSelectionId = undefined;
    setSelecting(false);
    setPanelOpen(false);
    panel.hidden = true;
    trigger.hidden = false;
  };
  const select = (selection: InspectorSelection) => {
    activeSelectionId = selection.id;
    setSelecting(false);
    trigger.hidden = true;
    panel.hidden = false;
    setPanelOpen(true);
    renderPanel(panel, selection.context, topicFor(selection.productRef), close);
  };

  trigger.addEventListener('click', () => {
    setSelecting(true);
  });

  const onMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    const message = event.data as { type?: string; payload?: unknown } | null;
    if (!message?.type) return;
    if (message.type === 'opt-ui:ready') {
      frameReady = true;
      frame.contentWindow?.postMessage({ type: 'opt-ui:ping' }, window.location.origin);
      if (selecting) sendToFrame({ type: 'opt-ui:set-activation', payload: { alwaysOn: true } });
      return;
    }
    if (message.type === inspectorMessage.cancel) {
      close();
      return;
    }
    if (message.type === inspectorMessage.selection) {
      select(message.payload as InspectorSelection);
      return;
    }
    if (message.type === inspectorMessage.selector) {
      const payload = message.payload as InspectorSelector;
      if (!payload.cssSelector || payload.id !== activeSelectionId) return;
      const current = panel.dataset.selectionContext;
      const productReference = panel.dataset.selectionProductRef as ProductRef | undefined;
      if (!current) return;
      renderPanel(panel, { ...(JSON.parse(current) as ElementContext), cssSelector: payload.cssSelector }, topicFor(productReference), close);
    }
  };
  window.addEventListener('message', onMessage);

  const onFrameLoad = () => {
    frameReady = true;
    close();
    frame.contentWindow?.postMessage({ type: 'opt-ui:ping' }, window.location.origin);
  };
  frame.addEventListener('load', onFrameLoad);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || (panel.hidden && !selecting)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  document.addEventListener('keydown', onKeyDown, true);

  return {
    destroy: () => {
      activeSelectionId = undefined;
      setSelecting(false);
      window.removeEventListener('message', onMessage);
      frame.removeEventListener('load', onFrameLoad);
      document.removeEventListener('keydown', onKeyDown, true);
      panel.remove();
      toolRail.remove();
    },
  };
}

function renderPanel(panel: HTMLElement, context: ElementContext, topic: ResolvedProductReference | undefined, close: () => void) {
  panel.dataset.selectionContext = JSON.stringify(context);
  if (topic) panel.dataset.selectionProductRef = topic.id;
  else delete panel.dataset.selectionProductRef;

  const header = document.createElement('header');
  header.className = 'prototypeInspectorHeader';
  const title = document.createElement('div');
  title.innerHTML = '<span>ProductWiki</span><b>产品讲解</b>';
  const closeButton = iconButton('关闭元素信息', X);
  closeButton.addEventListener('click', close);
  header.append(title, closeButton);

  const content = document.createElement('div');
  content.className = 'prototypeInspectorContent';
  content.append(topic ? wikiTopic(topic) : emptyTopic());
  content.append(technicalDetails(context));
  panel.replaceChildren(header, content);
}

function topicFor(productReference: ProductRef | undefined) {
  return productReference ? resolveProductReference(productReference) : undefined;
}

function wikiTopic(topic: ResolvedProductReference) {
  const section = document.createElement('section');
  section.className = 'prototypeInspectorTopic';
  const meta = document.createElement('div');
  meta.className = 'prototypeInspectorTags';
  meta.append(tag(topic.module), tag(topic.title), tag(`产品：${statusLabel(topic.productStatus)}`), tag(`原型：${coverageLabel(topic.prototypeCoverage)}`));
  const path = document.createElement('span');
  path.className = 'prototypeInspectorPath';
  path.textContent = topic.path;
  const article = document.createElement('article');
  article.className = 'prototypeInspectorMarkdown';
  article.innerHTML = DOMPurify.sanitize(marked.parse(topic.markdown, { gfm: true }) as string);
  const change = document.createElement('p');
  change.className = 'prototypeInspectorChange';
  change.textContent = `最近变更 ${topic.latestChange.version} · ${topic.latestChange.date} · ${topic.latestChange.summary}`;
  section.append(meta, path, change, article);
  return section;
}

function statusLabel(status: ResolvedProductReference['productStatus']) {
  return ({ roadmap: '路线图', released: '已发布', deprecated: '已废弃' })[status];
}

function coverageLabel(coverage: ResolvedProductReference['prototypeCoverage']) {
  return ({ none: '未覆盖', partial: '部分覆盖', complete: '完整覆盖' })[coverage];
}

function emptyTopic() {
  const empty = document.createElement('p');
  empty.className = 'prototypeInspectorEmpty';
  empty.textContent = '该元素暂无产品说明';
  return empty;
}

function technicalDetails(context: ElementContext) {
  const details = document.createElement('details');
  details.className = 'prototypeInspectorDetails';
  const summary = document.createElement('summary');
  summary.textContent = '元素信息';
  const body = document.createElement('div');
  body.className = 'prototypeInspectorDetailsBody';
  body.append(
    tags(context),
    field('可见文本', context.innerText, true),
    field('CSS 选择器', context.cssSelector, true, true),
    field('DOM 路径', context.domPath, true, true),
    field('源码位置', sourceLocation(context), true, true),
    field('Props', formatValue(context.props), false, true),
    field('计算样式', formatValue(context.computedStyles), false, true),
    field('HTML', context.html, false, true)
  );
  details.append(summary, body);
  return details;
}

function tags(context: ElementContext) {
  const container = document.createElement('div');
  container.className = 'prototypeInspectorTags';
  container.append(tag(context.componentName || '未检测到组件'), tag(context.tagName ? `<${context.tagName}>` : '未检测到标签'));
  return container;
}

function field(label: string, value: string | undefined, copyable = false, code = false) {
  const container = document.createElement('section');
  container.className = 'prototypeInspectorField';
  const heading = document.createElement('div');
  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  heading.append(labelElement);
  if (copyable && value) {
    const copy = iconButton(`复制${label}`, Copy);
    copy.className = 'prototypeInspectorCopy';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
        copy.replaceChildren(icon(Check));
        window.setTimeout(() => copy.replaceChildren(icon(Copy)), 1600);
      } catch {
        showToast('复制失败');
      }
    });
    heading.append(copy);
  }
  const content = document.createElement('div');
  content.className = `prototypeInspectorFieldValue${code ? ' is-code' : ''}`;
  content.textContent = value || '未检测到';
  container.append(heading, content);
  return container;
}

function tag(value: string) {
  const element = document.createElement('span');
  element.className = 'prototypeInspectorTag';
  element.textContent = value;
  return element;
}

function iconButton(label: string, iconNode: IconNode) {
  const button = document.createElement('button');
  button.type = 'button';
  button.title = label;
  button.setAttribute('aria-label', label);
  button.append(icon(iconNode));
  return button;
}

function icon(iconNode: IconNode) {
  return createElement(iconNode, { width: 16, height: 16, 'aria-hidden': 'true' });
}

function sourceLocation(context: ElementContext) {
  if (!context.filePath) return undefined;
  return context.lineNumber ? `${context.filePath}:${context.lineNumber}` : context.filePath;
}

function formatValue(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(value, (_key, item) => {
      if (typeof item === 'symbol' || typeof item === 'bigint') return item.toString();
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[Circular]';
        seen.add(item);
      }
      return item;
    }, 2);
  } catch {
    return '无法序列化';
  }
}

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'prototypeInspectorToast';
  toast.textContent = message;
  document.getElementById(ROOT_ID)?.append(toast);
  window.setTimeout(() => toast.remove(), 1800);
}
