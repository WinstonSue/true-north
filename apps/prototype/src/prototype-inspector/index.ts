import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Check, Copy, Inspect, X, createElement, type IconNode } from 'lucide';
import { generateCssSelector, init, type ElementContext, type ElementSelectorController } from 'fe-selector/core';
import { findProductWikiTopicForElement, type ProductWikiTopic } from '../shared/product-wiki';
import './style.css';

type InspectorHandle = { destroy: () => void };

const ROOT_ID = 'prototype-inspector';

export function bootstrapPrototypeInspector(): InspectorHandle {
  const root = document.getElementById(ROOT_ID);
  if (!root) throw new Error('#prototype-inspector is required');
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

  let controller: ElementSelectorController | undefined;
  let selectionVersion = 0;

  const destroyController = () => {
    controller?.destroy();
    controller = undefined;
  };

  const close = () => {
    selectionVersion += 1;
    destroyController();
    panel.hidden = true;
    trigger.hidden = false;
    trigger.removeAttribute('aria-pressed');
    root.classList.remove('is-selecting');
  };

  trigger.addEventListener('click', () => {
    selectionVersion += 1;
    destroyController();
    controller = init({
      activationKey: 'alt',
      isSelectable: (element) => !element.closest('[data-prototype-inspector-ui]'),
      onSelect: (context, element) => {
        const version = ++selectionVersion;
        destroyController();
        trigger.hidden = true;
        root.classList.remove('is-selecting');
        renderPanel(panel, context, findProductWikiTopicForElement(element), close);
        panel.hidden = false;

        void generateCssSelector(element).then((cssSelector) => {
          if (version !== selectionVersion || !cssSelector) return;
          renderPanel(panel, { ...context, cssSelector }, findProductWikiTopicForElement(element), close);
        });
      },
    });
    controller.activate();
    trigger.setAttribute('aria-pressed', 'true');
    root.classList.add('is-selecting');
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || (panel.hidden && !root.classList.contains('is-selecting'))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  document.addEventListener('keydown', onKeyDown, true);

  return {
    destroy: () => {
      selectionVersion += 1;
      document.removeEventListener('keydown', onKeyDown, true);
      destroyController();
      root.classList.remove('is-selecting');
      panel.remove();
      toolRail.remove();
    },
  };
}

function renderPanel(panel: HTMLElement, context: ElementContext, topic: ProductWikiTopic | undefined, close: () => void) {
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

function wikiTopic(topic: ProductWikiTopic) {
  const section = document.createElement('section');
  section.className = 'prototypeInspectorTopic';
  const meta = document.createElement('div');
  meta.className = 'prototypeInspectorTags';
  meta.append(tag(topic.module), tag(topic.title));
  const path = document.createElement('span');
  path.className = 'prototypeInspectorPath';
  path.textContent = topic.path;
  const article = document.createElement('article');
  article.className = 'prototypeInspectorMarkdown';
  article.innerHTML = DOMPurify.sanitize(marked.parse(topic.markdown, { gfm: true }) as string);
  section.append(meta, path, article);
  return section;
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
    field('HTML', context.html, false, true),
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
