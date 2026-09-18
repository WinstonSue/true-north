---
title: "Anchor"
description: "Hyperlinks to scroll on one page."
---

## When To Use

For displaying anchor hyperlinks on page and jumping between them.

> Notes for developers
>
> After version `4.24.0`, we rewrite Anchor use FC, Some methods of obtaining `ref` and calling internal instance methods will invalid.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Horizontal Anchor | demo/horizontal.md |
| Static Anchor | demo/static.md |
| Customize the onClick event | demo/onClick.md |
| Customize the anchor highlight | demo/customizeHighlight.md |
| Set Anchor scroll offset | demo/targetOffset.md |
| Listening for anchor link change | demo/onChange.md |
| Replace href in history | demo/replace.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Anchor Props

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| affix | Fixed mode of Anchor | boolean \| Omit<AffixProps, 'offsetTop' \| 'target' \| 'children'> | true | object: 5.19.0 | × |
| bounds | Bounding distance of anchor area | number | 5 |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| getContainer | Scrolling container | () => HTMLElement | () => window |  | × |
| getCurrentAnchor | Customize the anchor highlight | (activeLink: string) => string | - |  | × |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |  | × |
| showInkInFixed | Whether show ink-square when `affix={false}` | boolean | false |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#anchor-demo-targetoffset) | number | - |  | × |
| onChange | Listening for anchor link change | (currentActiveLink: string) => void |  |  | × |
| onClick | Set the handler to handle `click` event | (e: MouseEvent, link: object) => void | - |  | × |
| items | Data configuration option content, support nesting through children | { key, href, title, target, children }\[] [see](#anchoritem) | - | 5.1.0 | × |
| direction | Set Anchor direction | `vertical` \| `horizontal` | `vertical` | 5.2.0 | × |
| replace | Replace items' href in browser history instead of pushing it | boolean | false | 5.7.0 | × |

### AnchorItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier of the Anchor Link | string \| number | - |  |
| href | The target of hyperlink | string |  |  |
| target | Specifies where to display the linked URL | string |  |  |
| title | The content of hyperlink | ReactNode |  |  |
| children | Nested Anchor Link, `Attention: This attribute does not support horizontal orientation` | [AnchorItem](#anchoritem)\[] | - |  |
| replace | Replace item href in browser history instead of pushing it | boolean | false | 5.7.0 |
| targetOffset | Customize scroll offset for this anchor link. It takes precedence over the `targetOffset` prop of the Anchor component | number | - | 6.4.0 |

### Link Props

We recommend using the items form instead.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| href | The target of hyperlink | string |  |  |
| target | Specifies where to display the linked URL | string |  |  |
| title | The content of hyperlink | ReactNode |  |  |
| targetOffset | Customize scroll offset for this anchor link. It takes precedence over the `targetOffset` prop of the Anchor component | number | - | 6.4.0 |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### In version `5.25.0+`, the `:target` pseudo-class of the destination element does not take effect as expected after anchor navigation. {#faq-target-pseudo-class}

For the purpose of page performance optimization, the implementation of anchor navigation has been changed from `window.location.href` to `window.history.pushState/replaceState`. Since `pushState/replaceState` does not trigger a page reload, the browser will not automatically update the matching state of the `:target` pseudo-class. To resolve this issue, you can manually construct the full URL: `href = window.location.origin + window.location.pathname + '#xxx'`.

Related issues: [#53143](https://github.com/yuce-design/yuce-design/issues/53143) [#54255](https://github.com/yuce-design/yuce-design/issues/54255)
