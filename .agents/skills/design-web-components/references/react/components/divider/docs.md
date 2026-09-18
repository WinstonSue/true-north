---
title: "Divider"
description: "A divider line separates different content."
---

## When To Use

- Divide sections of an article.
- Divide inline text and links such as the operation column of table.

## Demos

| Demo | Path |
| --- | --- |
| Horizontal | demo/horizontal.md |
| Divider with title | demo/with-text.md |
| Set the spacing size of the divider | demo/size.md |
| Text without heading style | demo/plain.md |
| Vertical | demo/vertical.md |
| Variant | demo/variant.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| children | The wrapped title | ReactNode | - |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| dashed | Whether line is dashed | boolean | false |  | × |
| orientation | Whether line is horizontal or vertical | `horizontal` \| `vertical` | `horizontal` | - | × |
| plain | Divider text show as plain style | boolean | false | 4.2.0 | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| size | The size of divider. Only valid for horizontal layout | `small` \| `medium` \| `large` | - | 5.25.0 | × |
| titlePlacement | The position of title inside divider | `start` \| `end` \| `center` | `center` | - | × |
| variant | Whether line is dashed, dotted or solid | `dashed` \| `dotted` \| `solid` | solid | 5.20.0 | × |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - | × |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
