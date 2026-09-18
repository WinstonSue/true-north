---
title: "Timeline"
description: "Vertical display timeline."
---

## When To Use

- When a series of information needs to be ordered by time (ascending or descending).
- When you need a timeline to make a visual connection.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Variant | demo/variant.md |
| Loading and Reversing | demo/pending.md |
| Alternate | demo/alternate.md |
| Horizontal | demo/horizontal.md |
| Custom | demo/custom.md |
| End alternate | demo/end.md |
| Title | demo/title.md |
| Title Offset | demo/title-span.md |
| Semantic Sample | demo/semantic.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Timeline

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| items | Each node of timeline | [Items](#items)[] | - |  | × |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right | `start` \| `alternate` \| `end` | `start` |  | × |
| orientation | Set the direction of the timeline | `vertical` \| `horizontal` | `vertical` |  | × |
| reverse | Whether reverse nodes or not | boolean | false |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| titleSpan | Set the title span space. It is the distance to the center of the dot <InlinePopover previewURL="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1NJISa7bpqgAAAAAR5AAAAgAerJ8AQ/original"></InlinePopover> | number \| string | 12 |  | × |
| variant | Config style variant | `filled` \| `outlined` | `outlined` |  | × |

### Items

Node of timeline.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green`, `gray` or other custom colors | string | `blue` |
| content | Set the content | ReactNode | - |
| icon | Customize node icon | ReactNode | - |
| loading | Set loading state | boolean | false |
| placement | Customize node placement | `start` \| `end` | - |
| title | Set the title | ReactNode | - |

## Semantic DOM

### Timeline

See `demo/_semantic.md`.

### Timeline Items

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
