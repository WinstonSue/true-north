---
title: ContextMenu
description: A command menu triggered by right-click.
---

## When To Use

- Use ContextMenu for command menus that open on right-click and follow the cursor. See `demo/basic.md`.
- Use extra nodes, submenus, click events, or custom popup content for richer command menus. See `demo/extra.md`, `demo/sub-menu.md`, `demo/event.md`, and `demo/custom.md`.
- Use `open` / `openChange` when closing behavior needs to be controlled. See `demo/overlay-open.md`.
- Prefer Dropdown when the trigger should be hover or click. Prefer Select for choosing form values.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Extra node | demo/extra.md |
| Cascading menu | demo/sub-menu.md |
| Click event | demo/event.md |
| Custom dropdown | demo/custom.md |
| The way of hiding menu | demo/overlay-open.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

`ContextMenu` aligns with [Dropdown](../dropdown/docs.md) props, except `trigger` is omitted (always right-click).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the ContextMenu component. Supports object or function | DropdownClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the ContextMenu component. Supports object or function | DropdownStylesType | - | - |
| menu | The menu props | MenuProps & &#123; activeKey?: VcMenuProps['activeKey'], onClick?: MenuEmits['click'] &#125; | - | - |
| autoFocus | Focus the first menu item when opened | boolean | - | - |
| arrow | Whether the dropdown arrow should be visible. Supports `pointAtCenter` | boolean \| DropdownArrowOptions | false | - |
| popupRender | Customize popup content | (menu: VueNode) =&gt; VueNode | - | - |
| open | Whether the dropdown menu is currently open | boolean | - | - |
| disabled | Whether the dropdown menu is disabled | boolean | - | - |
| destroyOnHidden | Whether destroy dropdown when hidden | boolean | false | - |
| align | Popup align config | AlignType | - | - |
| getPopupContainer | To set the container of the dropdown menu. The default is to create a div element in body, but you can reset it to the scrolling area and make a relative reposition. | (triggerNode: HTMLElement) =&gt; HTMLElement |  =&gt; document.body | - |
| prefixCls | Customize prefix class name | string | - | - |
| transitionName | Motion name of dropdown | string | - | - |
| placement | Placement of popup menu: `bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight` | Placement | `bottomLeft` | - |
| forceRender | Force render dropdown overlay | boolean | - | - |
| mouseEnterDelay | Delay in seconds before showing dropdown | number | 0.15 | - |
| mouseLeaveDelay | Delay in seconds before hiding dropdown | number | 0.1 | - |
| openClassName | Class added to trigger when dropdown is open | string | - | - |
| autoAdjustOverflow | Whether to adjust dropdown placement automatically when dropdown is off screen | boolean \| AdjustOverflow | true | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Called when the open state is changed. Not trigger when hidden by click item | (open: boolean, info: &#123; source: 'trigger' \| 'menu' &#125;) =&gt; void | - |
| menuClick | Callback when menu item clicked | MenuEmits['click'] | - |

### Slots

| Slot        | Description             | Type                      | Version |
|-------------|-------------------------|---------------------------| ---     |
| popupRender | Customize popup content | (menu: VueNode) =&gt; any | -       |
| labelRender | Customize label content | (item: Item) =&gt; any    | -       |

ContextMenu also supports Menu slots (such as `labelRender`).

## Note

Please ensure that the child node of `ContextMenu` accepts the `contextmenu` event. The pop-up menu position will follow the right-click position.

## Semantic DOM

| _semantic | demo/_semantic.md |

## Design Token

Styles are reused from Dropdown. Token names are the same as [Dropdown](../dropdown/docs.md). See `token.md`.
