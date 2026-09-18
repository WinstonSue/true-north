---
title: "Menu"
description: "A versatile menu for navigation."
---

## When To Use

Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Yuce Design offers two navigation options: top and side. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](/components/layout).

## Demos

| Demo | Path |
| --- | --- |
| Top Navigation | demo/horizontal.md |
| Inline menu | demo/inline.md |
| Collapsed inline menu | demo/inline-collapsed.md |
| Open current submenu only | demo/sider-current.md |
| Vertical menu | demo/vertical.md |
| Menu Themes | demo/theme.md |
| Sub-menu theme | demo/submenu-theme.md |
| Switch the menu type | demo/switch-mode.md |
| Custom semantic dom styling | demo/style-class.md |
| Custom Submenu Render | demo/custom-popup-render.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Menu

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| defaultOpenKeys | Array with the keys of default opened sub menus | string\[] | - |  | × |
| defaultSelectedKeys | Array with the keys of default selected menu items | string\[] | - |  | × |
| expandIcon | custom expand icon of submenu | ReactNode \| `(props: SubMenuProps & { isSubMenu: boolean }) => ReactNode` | - | 4.9.0 | 5.15.0 |
| forceSubMenuRender | Render submenu into DOM before it becomes visible | boolean | false |  | × |
| inlineCollapsed | Specifies the collapsed status when menu is inline mode | boolean | - |  | × |
| inlineIndent | Indent (in pixels) of inline menu items on each level | number | 24 |  | × |
| items | Menu item content | [ItemType\[\]](#itemtype) | - | 4.20.0 | × |
| mode | Type of menu | `vertical` \| `horizontal` \| `inline` | `vertical` |  | × |
| multiple | Allows selection of multiple items | boolean | false |  | × |
| openKeys | Array with the keys of currently opened sub-menus | string\[] | - |  | × |
| overflowedIndicator | Customized the ellipsis icon when menu is collapsed horizontally | ReactNode | `<Ellipsis />` |  | × |
| selectable | Allows selecting menu items | boolean | true |  | × |
| selectedKeys | Array with the keys of currently selected menu items | string\[] | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| subMenuCloseDelay | Delay time to hide submenu when mouse leaves (in seconds) | number | 0.1 |  | × |
| subMenuOpenDelay | Delay time to show submenu when mouse enters, (in seconds) | number | 0 |  | × |
| tooltip | Config tooltip props for menu items in inline collapsed mode. Set to `false` to disable. | false \| TooltipProps | - | 6.3.0 | × |
| theme | Color theme of the menu | `light` \| `dark` | `light` |  | × |
| triggerSubMenuAction | Which action can trigger submenu open/close | `hover` \| `click` | `hover` |  | × |
| onClick | Called when a menu item is clicked | function({ key, keyPath, domEvent, itemData }) | - |  | × |
| onDeselect | Called when a menu item is deselected (multiple mode only) | function({ key, keyPath, selectedKeys, domEvent, itemData }) | - |  | × |
| onOpenChange | Called when sub-menus are opened or closed | function(openKeys: string\[]) | - |  | × |
| onSelect | Called when a menu item is selected | function({ key, keyPath, selectedKeys, domEvent, itemData }) | - |  | × |
| popupRender | Custom popup renderer for submenu | (node: ReactElement, props: { item: SubMenuProps; keys: string[] }) => ReactElement | - |  | × |

> More options in [@rc-component/menu](https://github.com/react-component/menu#api)

### ItemType

> type ItemType = [MenuItemType](#menuitemtype) | [SubMenuType](#submenutype) | [MenuItemGroupType](#menuitemgrouptype) | [MenuDividerType](#menudividertype);

#### MenuItemType

| Property | Description                          | Type      | Default | Version |
| -------- | ------------------------------------ | --------- | ------- | ------- |
| danger   | Display the danger style             | boolean   | false   |         |
| disabled | Whether menu item is disabled        | boolean   | false   |         |
| extra    | The extra of the menu item           | ReactNode | -       | 5.21.0  |
| icon     | The icon of the menu item            | ReactNode | -       |         |
| key      | Unique ID of the menu item           | string    | -       |         |
| label    | Menu label                           | ReactNode | -       |         |
| title    | Set display title for collapsed item | string    | -       |         |

#### SubMenuType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Sub-menus or sub-menu items | [ItemType\[\]](#itemtype) | - |  |
| disabled | Whether sub-menu is disabled | boolean | false |  |
| icon | Icon of sub menu | ReactNode | - |  |
| key | Unique ID of the sub-menu | string | - |  |
| label | Menu label | ReactNode | - |  |
| popupClassName | Sub-menu class name, not working when `mode="inline"` | string | - |  |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | \[number, number] | - |  |
| theme | Color theme of the SubMenu (inherits from Menu by default) | `light` \| `dark` | - |  |
| onTitleClick | Callback executed when the sub-menu title is clicked | function({ key, domEvent }) | - |  |
| popupRender | Custom popup renderer for current sub-menu | (node: ReactElement, props: { item: SubMenuProps; keys: string[] }) => ReactElement | - |  |

#### MenuItemGroupType

Define `type` as `group` to make as group:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
};
```

| Property | Description            | Type                              | Default | Version |
| -------- | ---------------------- | --------------------------------- | ------- | ------- |
| children | Sub-menu items         | [MenuItemType\[\]](#menuitemtype) | -       |         |
| label    | The title of the group | ReactNode                         | -       |         |

#### MenuDividerType

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu. Need define the `type` as `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
};
```

| Property | Description            | Type    | Default | Version |
| -------- | ---------------------- | ------- | ------- | ------- |
| dashed   | Whether line is dashed | boolean | false   |         |

## FAQ

### Why will Menu's children be rendered twice? {#faq-render-twice}

Menu collects structure info with [twice-render](https://github.com/react-component/menu/blob/f4684514096d6b7123339cbe72e7b0f68db0bce2/src/Menu.tsx#L543) to support HOC usage. Merging into one render may cause the logic to become much more complex. Contributions to help improve the collection logic are welcomed.

### Why Menu do not responsive collapse in Flex layout? {#faq-flex-layout}

Menu will render fully item in flex layout and then collapse it. You need tell flex not consider Menu width to enable responsive ([online demo](https://codesandbox.io/s/ding-bu-dao-hang-antd-4-21-7-forked-5e3imy?file=/demo.js)):

```jsx
<div style={{ flex }}>
  <div style={{ ... }}>Some Content</div>
  <Menu style={{ minWidth: 0, flex: "auto" }} />
</div>
```

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
