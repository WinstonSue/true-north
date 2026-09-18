---
title: Affix
description: Stick an element to the viewport.
---

## When To Use

- Use Affix when an action bar, anchor menu, or helper panel should stay visible while the page scrolls. See `demo/basic.md`.
- Use `target` when the sticky element belongs to a specific scroll container. See `demo/target.md`.
- Use `change` only when the affixed state needs to drive business UI. See `demo/on-change.md`.
- Prefer native `position: sticky` for simple CSS-only sticky behavior, especially in horizontal scrolling layouts.

## Demos

| Demo                 | Path              |
| -------------------- | ----------------- |
| Basic                | demo/basic.md     |
| Callback             | demo/on-change.md |
| Container to scroll. | demo/target.md    |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property     | Description                                        | Type                                   | Default         | Version |
| ------------ | -------------------------------------------------- | -------------------------------------- | --------------- | ------- |
| offsetTop    | Offset from the top of the viewport (in pixels)    | number                                 | 0               | -       |
| offsetBottom | Offset from the bottom of the viewport (in pixels) | number                                 | -               | -       |
| target       | Specifies the scrollable area DOM node             |  =&gt; Window \| HTMLElement \| null |  =&gt; window | -       |

### Events

| Event  | Description                              | Type                           | Version |
| ------ | ---------------------------------------- | ------------------------------ | ------- |
| change | Callback for when Affix state is changed | (affixed?: boolean) =&gt; void | -       |

### Methods

| Method         | Description | Type                                              | Version |
| -------------- | ----------- | ------------------------------------------------- | ------- |
| updatePosition | -           | ReturnType&lt;typeof throttleByAnimationFrame&gt; | -       |

**Note:** Children of `Affix` must not have the property `position: absolute`, but you can set `position: absolute` on `Affix` itself:

## FAQ

### When binding container with `target` in Affix, elements sometimes move out of the container.

We only listen to container scroll events for performance consideration. You can add custom listeners if you still want to: <https://codesandbox.io/s/stupefied-maxwell-ophqnm?file=/index.js>

Related issues：[#3938] [#5642] [#16120]

### When Affix is ​​used in a horizontal scroll container, the position of the element `left` is incorrect.

Affix is ​​generally only applicable to areas with one-way scrolling, and only supports usage in vertical scrolling containers. If you want to use it in a horizontal container, you can consider implementing with the native `position: sticky` property.

Related issues：[#29108]
