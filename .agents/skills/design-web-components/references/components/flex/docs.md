---
title: Flex
description: A flex layout container for alignment.
---

## When To Use

- Use Flex for simple one-dimensional layout, alignment, gap, and wrapping. See `demo/basic.md`.
- Use align, gap, wrap, or container demos to tune layout behavior without writing custom flex CSS. See `demo/align.md`, `demo/gap.md`, `demo/wrap.md`, and `demo/container.md`.
- Use combination layouts when composing compact control groups. See `demo/combination.md`.
- Prefer Grid when layout needs 24-column responsive spans.

## Demos

| Demo | Path |
| --- | --- |
| basic | demo/basic.md |
| align | demo/align.md |
| gap | demo/gap.md |
| container | demo/container.md |
| wrap | demo/wrap.md |
| combination | demo/combination.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| vertical | Is direction of the flex vertical, use `flex-direction: column` | boolean | `false` | - |
| wrap | Set whether the element is displayed in a single line or in multiple lines | boolean \| CSSProperties['flexWrap'] | nowrap | boolean: 5.17.0 |
| justify | Sets the alignment of elements in the direction of the main axis | CSSProperties['justifyContent'] | normal | - |
| align | Sets the alignment of elements in the direction of the cross axis | CSSProperties['alignItems'] | normal | - |
| flex | flex CSS shorthand properties | CSSProperties['flex'] | normal | - |
| gap | Sets the gap between elements. Preset values refer to [spacing preset tokens](../../global-token.md#spacing-presets) | CSSProperties['gap'] \| SizeType | - | - |
| container | Sets the size and flex behavior of the Flex root container | `full` \| `fixed` \| `fill` | - | - |

### Container

| Value | Style effect | Use case |
| --- | --- | --- |
| `full` | `width: 100%; height: 100%` | A container sized by its parent |
| `fixed` | `flex-grow: 0; flex-shrink: 0` | A flex item that keeps its own size without growing or shrinking |
| `fill` | `width: 100%; height: 100%; flex: 1 1 content; min-width: 0; min-height: 0` | A flex item that fills the remaining space |
