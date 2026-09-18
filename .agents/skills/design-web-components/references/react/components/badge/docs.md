---
title: "Badge"
description: "Small numerical value or status descriptor for UI elements."
---

## When To Use

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Standalone | demo/no-wrapper.md |
| Overflow Count | demo/overflow.md |
| Red badge | demo/dot.md |
| Dynamic | demo/change.md |
| Clickable | demo/link.md |
| Offset | demo/offset.md |
| Size | demo/size.md |
| Status | demo/status.md |
| Colorful Badge | demo/colorful.md |
| Ribbon | demo/ribbon.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |
|  semantic ribbon | demo/_semantic_ribbon.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Badge

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| color | Customize Badge dot color | string | - |  | × |
| count | Number to show in badge | ReactNode | - |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.7.0 |
| dot | Whether to display a red dot instead of `count` | boolean | false |  | × |
| offset | Set offset of the badge dot | \[number, number] | - |  | × |
| overflowCount | Max count to show | number | 99 |  | × |
| showZero | Whether to show badge when `count` is zero | boolean | false |  | × |
| size | If `count` is set, `size` sets the size of badge | `medium` \| `small` | - | - | × |
| status | Set Badge as a status dot | `success` \| `processing` \| `default` \| `error` \| `warning` | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.7.0 |
| text | If `status` is set, `text` sets the display text of the status `dot` | ReactNode | - |  | × |
| title | Text to show when hovering over the badge. Set to `null` or `false` to remove the native tooltip | string \| null \| false | - | 6.5.0 | × |

### Badge.Ribbon

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| color | Customize Ribbon color | string | - |  | × |
| placement | The placement of the Ribbon, `start` and `end` follow text direction (RTL or LTR) | `start` \| `end` | `end` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| text | Content inside the Ribbon | ReactNode | - |  | × |

## Semantic DOM

### Badge

See `demo/_semantic.md`.

### Badge.Ribbon

See `demo/_semantic_ribbon.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
