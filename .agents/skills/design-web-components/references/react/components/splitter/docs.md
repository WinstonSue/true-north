---
title: "Splitter"
description: "Resizable split panel layout"
---

## When To Use

Can be used to separate areas horizontally or vertically. When you need to freely drag and adjust the size of each area. When you need to specify the maximum and minimum width and height of an area.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/size.md |
| Control mode | demo/control.md |
| Vertical | demo/vertical.md |
| Collapsible | demo/collapsible.md |
| Control collapsible icons | demo/collapsibleIcon.md |
| Multiple panels | demo/multiple.md |
| Complex combination | demo/group.md |
| Lazy | demo/lazy.md |
| Custom semantic dom styling | demo/style-class.md |
| Double-clicked reset | demo/reset.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> The Splitter component needs to calculate the panel size through its child elements, so its child elements only support `Splitter.Panel`.

### Splitter

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | 6.0.0 | 6.0.0 |
| collapsible | `motion` to enable collapse animation, `icon` to customize collapse icons | `{ motion?: boolean; icon?: { start?: ReactNode; end?: ReactNode } }` | - | 6.4.0 | × |
| destroyOnHidden | Destroy panel content when collapsed (size is 0). Applies to all panels, can be overridden per panel | `boolean` | `false` | 6.4.0 | × |
| draggerIcon | custom dragger icon | `ReactNode` | - | 6.0.0 | × |
| lazy | Lazy mode | `boolean` | `false` | 5.23.0 | × |
| onCollapse | Callback when expanding or collapsing | `(collapsed: boolean[], sizes: number[]) => void` | - | 5.28.0 | × |
| orientation | Orientation direction | `horizontal` \| `vertical` | `horizontal` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 6.0.0 | 6.0.0 |
| vertical | Orientation. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | `false` |  | × |
| onDraggerDoubleClick | Callback triggered when the dragger is double-clicked | `(index: number) => void` | - | 6.3.0 | × |
| onResize | Panel size change callback | `(sizes: number[]) => void` | - | - | × |
| onResizeEnd | Drag end callback | `(sizes: number[]) => void` | - | - | × |
| onResizeStart | Callback before dragging starts | `(sizes: number[]) => void` | - | - | × |

### Panel

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Quick folding | `boolean \| { start?: boolean; end?: boolean; showCollapsibleIcon?: boolean \| 'auto' }` | `false` | showCollapsibleIcon: 5.27.0 |
| defaultSize | Initial panel size support number for px or 'percent%' usage | `number \| string` | - | - |
| destroyOnHidden | Destroy panel content when collapsed (size is 0). Overrides Splitter's `destroyOnHidden` | `boolean` | - | 6.4.0 |
| max | Maximum threshold support number for px or 'percent%' usage | `number \| string` | - | - |
| min | Minimum threshold support number for px or 'percent%' usage | `number \| string` | - | - |
| resizable | Whether to enable drag and drop | `boolean` | `true` | - |
| size | Controlled panel size support number for px or 'percent%' usage | `number \| string` | - | - |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
