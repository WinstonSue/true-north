---
title: "ContextMenu"
description: "A command menu triggered by right-click."
---

## When To Use

Use ContextMenu to show a command menu when the user right-clicks a region or element. The popup follows the cursor position.

- Collect a group of commands related to the current area.
- Compared with [Dropdown](/components/dropdown), the trigger is always right-click, so you do not need to set `trigger`.
- Prefer Select for choosing form values and ContextMenu for command groups.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Extra node | demo/extra.md |
| Cascading menu | demo/sub-menu.md |
| Click event | demo/event.md |
| Custom dropdown | demo/custom.md |
| The way of hiding menu. | demo/overlay-open.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

`ContextMenu` aligns with [Dropdown](../dropdown/docs.md) props, except `trigger` is omitted (always right-click).

### ContextMenu

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| arrow | Whether the dropdown arrow should be visible | boolean \| { pointAtCenter: boolean } | false |  | × |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean | true |  | × |
| classNames | Customize class for each semantic structure inside the ContextMenu component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | dropdown |
| disabled | Whether the dropdown menu is disabled | boolean | - |  | × |
| destroyOnHidden | Whether destroy dropdown when hidden | boolean | false |  | × |
| popupRender | Customize popup content | (menus: ReactNode) => ReactNode | - |  | × |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  | × |
| menu | The menu props | [MenuProps](/components/menu/#api) | - |  | × |
| placement | Placement of popup menu: `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` | string | `bottomLeft` |  | × |
| styles | Customize inline style for each semantic structure inside the ContextMenu component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | dropdown |
| open | Whether the dropdown menu is currently open | boolean | - |  | × |
| onOpenChange | Called when the open state is changed. Not trigger when hidden by click item | (open: boolean, info: { source: 'trigger' \| 'menu' }) => void | - |  | × |

## Note

Please ensure that the child node of `ContextMenu` accepts `onContextMenu` events. The pop-up menu position will follow the right-click position.

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

Styles are reused from Dropdown. Token names are the same as [Dropdown](../dropdown/docs.md#design-token).

See `token.md` for component token definitions.</ComponentTokenTable>
