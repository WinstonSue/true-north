---
title: "Flex"
description: "A flex layout container for alignment."
---

## When To Use

- Good for setting spacing between elements.
- Suitable for setting various horizontal and vertical alignments.

### Difference with Space component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| align | demo/align.md |
| gap | demo/gap.md |
| Wrap | demo/wrap.md |
| combination | demo/combination.md |
| container | demo/container.md |

## API

> This component is available since `antd@5.10.0`. The default behavior of Flex in horizontal mode is to align upward, In vertical mode, aligns the stretch, You can adjust this via properties.

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| vertical | Is direction of the flex vertical, use `flex-direction: column` | boolean | false | 5.10.0 | 5.10.0 |
| wrap | Set whether the element is displayed in a single line or in multiple lines | [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap) \| boolean | nowrap | boolean: 5.17.0 | × |
| justify | Sets the alignment of elements in the direction of the main axis | [justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) | normal |  | × |
| align | Sets the alignment of elements in the direction of the cross axis | [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) | normal |  | × |
| flex | flex CSS shorthand properties | [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) | normal |  | × |
| gap | Sets the gap between grids | `small` \| `medium` \| `large` \| string \| number | - |  | × |
| container | Sets the size and flex behavior of the Flex root container | `full` \| `fixed` \| `fill` | - | - | × |
| component | custom element type | React.ComponentType | `div` |  | × |
| orientation | direction of the flex | `horizontal` \| `vertical` | `horizontal` | - | × |

### Container {#container}

| Value | Style effect | Use case |
| --- | --- | --- |
| `full` | `width: 100%; height: 100%` | A container sized by its parent |
| `fixed` | `flex-grow: 0; flex-shrink: 0` | A flex item that keeps its own size without growing or shrinking |
| `fill` | `width: 100%; height: 100%; flex: 1 1 content; min-width: 0; min-height: 0` | A flex item that fills the remaining space |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
