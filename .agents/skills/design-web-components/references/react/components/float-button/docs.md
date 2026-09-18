---
title: "FloatButton"
description: "A button that floats at the top of the page."
---

## When To Use

- For global functionality on the site.
- Buttons that can be seen wherever you browse.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Type | demo/type.md |
| Shape | demo/shape.md |
| Content | demo/content.md |
| FloatButton with tooltip | demo/tooltip.md |
| FloatButton Group | demo/group.md |
| Menu mode | demo/group-menu.md |
| Controlled mode | demo/controlled.md |
| placement | demo/placement.md |
| BackTop | demo/back-top.md |
| badge | demo/badge.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |
|  semantic group | demo/_semantic_group.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> This component is available since `antd@5.0.0`.

### common API

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| icon | Set the icon component of button | ReactNode | - |  | FloatButton: ×, BackTop: 5.27.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| content | Text and other | ReactNode | - |  | × |
| tooltip | The text shown in the tooltip | ReactNode \| [TooltipProps](../tooltip/docs.md#api) | - | TooltipProps: 5.25.0 | × |
| type | Setting button type | `default` \| `primary` | `default` |  | × |
| shape | Setting button shape | `circle` \| `square` | `circle` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| onClick | Set the handler to handle `click` event | (event) => void | - |  | × |
| href | The target of hyperlink | string | - |  | × |
| target | Specifies where to display the linked URL | string | - |  | × |
| htmlType | Set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button` | `button` | 5.21.0 | × |
| badge | Attach Badge to FloatButton. `status` and other props related are not supported. | [BadgeProps](../badge/docs.md#api) | - | 5.4.0 | × |
| disabled | Whether the button is disabled | boolean | - | 6.4.0 | × |

### FloatButton.Group

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| open | Whether the menu is visible or not, use it with trigger | boolean | - |  | × |
| closeIcon | Customize close button icon | React.ReactNode | `<X />` |  | 5.16.0 |
| placement | Customize menu animation placement | `top` \| `left` \| `right` \| `bottom` | `top` | 5.21.0 | × |
| shape | Setting button shape of children | `circle` \| `square` | `circle` |  | × |
| trigger | Which action can trigger menu open/close | `click` \| `hover` | - |  | × |
| onOpenChange | Callback executed when active menu is changed, use it with trigger | (open: boolean) => void | - |  | × |
| onClick | Set the handler to handle `click` event (only work in `Menu mode`) | (event) => void | - | 5.3.0 | × |

### FloatButton.BackTop

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Time to return to top（ms） | number | 450 |  |
| target | Specifies the scrollable area dom node | () => HTMLElement | () => window |  |
| visibilityHeight | The BackTop button will not show until the scroll height reaches this value | number | 400 |  |
| onClick | A callback function, which can be executed when you click the button | () => void | - |  |

## Semantic DOM

### FloatButton

See `demo/_semantic.md`.

### FloatButton.Group

See `demo/_semantic_group.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
