---
title: "Dropdown"
description: "A dropdown list."
---

## When To Use

When there are more than a few options to choose from, you can wrap them in a `Dropdown`. By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to choose an option and execute the relevant action. For a dedicated right-click menu, see [ContextMenu](/components/context-menu).

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Extra node | demo/extra.md |
| Placement | demo/placement.md |
| Arrow | demo/arrow.md |
| Other elements | demo/item.md |
| Arrow pointing at the center | demo/arrow-center.md |
| Trigger mode | demo/trigger.md |
| Click event | demo/event.md |
| Button with dropdown menu | demo/dropdown-button.md |
| Custom dropdown | demo/custom-dropdown.md |
| Cascading menu | demo/sub-menu.md |
| The way of hiding menu. | demo/overlay-open.md |
| Context Menu | demo/context-menu.md |
| Loading | demo/loading.md |
| Selectable Menu | demo/selectable.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Dropdown

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| arrow | Whether the dropdown arrow should be visible | boolean \| { pointAtCenter: boolean } | false |  | × |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean | true | 5.2.0 | × |
| classNames | Customize class for each semantic structure inside the Dropdown component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| disabled | Whether the dropdown menu is disabled | boolean | - |  | × |
| destroyOnHidden | Whether destroy dropdown when hidden | boolean | false | 5.25.0 | × |
| popupRender | Customize popup content | (menus: ReactNode) => ReactNode | - | 5.25.0 | × |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. [Example on CodePen](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  | × |
| menu | The menu props | [MenuProps](/components/menu/#api) | - |  | × |
| placement | Placement of popup menu: `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` | string | `bottomLeft` | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom`: 6.5.0 | × |
| styles | Customize inline style for each semantic structure inside the Dropdown component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| trigger | The trigger mode which executes the dropdown action. Note that hover can't be used on touchscreens | Array&lt;`click`\|`hover`\|`contextMenu`> | \[`hover`] |  | × |
| open | Whether the dropdown menu is currently open | boolean | - |  | × |
| onOpenChange | Called when the open state is changed. Not trigger when hidden by click item | (open: boolean, info: { source: 'trigger' \| 'menu' }) => void | - | `info.source`: 5.11.0 | × |

## Note

Please ensure that the child node of `Dropdown` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### How to prevent Dropdown from being squeezed when it exceeds the screen horizontally? {#faq-dropdown-squeezed}

You can use `width: max-content` style to handle this. ref [#43025](https://github.com/yuce-design/yuce-design/issues/43025#issuecomment-1594394135).
