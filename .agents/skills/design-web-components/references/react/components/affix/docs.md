---
title: "Affix"
description: "Stick an element to the viewport."
---

## When To Use

On longer web pages, it's helpful to stick component into the viewport. This is common for menus and actions.

Please note that Affix should not cover other content on the page, especially when the size of the viewport is small.

> Notes for developers
>
> After version `5.10.0`, we rewrite Affix use FC, some methods of obtaining `ref` and calling internal instance methods will be invalid.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Callback | demo/on-change.md |
| Container to scroll. | demo/target.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| offsetBottom | Offset from the bottom of the viewport (in pixels) | number | - |  | × |
| offsetTop | Offset from the top of the viewport (in pixels) | number | 0 |  | × |
| target | Specifies the scrollable area DOM node | () => Window \| HTMLElement \| null | () => window |  | × |
| onChange | Callback for when Affix state is changed | (affixed?: boolean) => void | - |  | × |

**Note:** Children of `Affix` must not have the property `position: absolute`, but you can set `position: absolute` on `Affix` itself:

```jsx
<Affix style={{ position: 'absolute', top: y, left: x }}>...</Affix>
```

## FAQ

### When binding container with `target` in Affix, elements sometimes move out of the container. {#faq-target-container}

We only listen to container scroll events for performance consideration. You can add custom listeners if you still want to: <https://codesandbox.io/s/stupefied-maxwell-ophqnm?file=/index.js>

Related issues：[#3938](https://github.com/yuce-design/yuce-design/issues/3938) [#5642](https://github.com/yuce-design/yuce-design/issues/5642) [#16120](https://github.com/yuce-design/yuce-design/issues/16120)

### When Affix is ​​used in a horizontal scroll container, the position of the element `left` is incorrect. {#faq-horizontal-scroll}

Affix is ​​generally only applicable to areas with one-way scrolling, and only supports usage in vertical scrolling containers. If you want to use it in a horizontal container, you can consider implementing with the native `position: sticky` property.

Related issues：[#29108](https://github.com/yuce-design/yuce-design/issues/29108)
