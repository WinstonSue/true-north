---
title: Breadcrumb
description: Display the current location within a hierarchy. And allow going back to states higher up in the hierarchy.
---

## When To Use

- Use Breadcrumb to show the current page location inside a hierarchy. See `demo/basic.md`.
- Use icons, params, or custom separators when route labels need richer context. See `demo/withIcon.md`, `demo/withParams.md`, and `demo/separator.md`.
- Use dropdown breadcrumb items when a hierarchy level has sibling navigation choices. See `demo/overlay.md`.
- For process progress, use the `step` scenario in `@sue/design-web-scenarios`; prefer Anchor for in-page section navigation.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| With an Icon | demo/withIcon.md |
| With Params | demo/withParams.md |
| Configuring the Separator | demo/separator.md |
| Bread crumbs with drop down menu | demo/overlay.md |
| Configuring the Separator Independently | demo/separator-component.md |
| SFC Mode | demo/sfc.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownIcon | Custom dropdown icon | VueNode | `<ChevronDown />` | - |
| itemRender | Custom item renderer, work with vue-router | (route, params, routes, paths) =&gt; VueNode | - | - |
| params | Routing parameters | object | - | - |
| items | The routing stack information of router | [ItemType\[\]](#itemtype) | - | - |
| separator | Custom separator | VueNode | `/` | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| clickItem | Triggered when clicking a breadcrumb item | (item: ItemType, event: MouseEvent) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| itemRender | Custom item renderer, work with vue-router | (route: ItemType, params: AnyObject, routes: ItemType[], paths: string[]) =&gt; any | - |
| titleRender | Custom title renderer | (params: \{ item: ItemType, index: number \}) =&gt; any | - |
| separator | Custom separator | () =&gt; any | - |
| menuLabelRender | Custom menu label renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |
| menuExtraRender | Custom menu extra content renderer | (params: \{ item: ItemType, index: number, menu: MenuItem \}) =&gt; any | - |

## Types 
### ItemType 
> type ItemType = Omit&lt;RouteItemType, 'title' | 'path'&gt; | SeparatorType

### RouteItemType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dropdownProps | The dropdown props | [Dropdown](../dropdown/docs.md) | - | - |
| href | Target of hyperlink. Can not work with path | string | - | - |
| path | Connected path. Each path will connect with prev one. Can not work with href | string | - | - |
| menu | The menu props | [MenuProps](../menu/docs.md#api) | - | - |
| onClick | Set the handler to handle click event | (e: MouseEvent) =&gt; void | - | - |
| title | item name | VueNode | - | - |

### SeparatorType 
```ts
const item = {
  type: 'separator', // Must have
  separator: '/',
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Mark as separator | `separator` | - | - |
| separator | Custom separator | VueNode | `/` | - |

## Use with vue-router 
The link of Breadcrumb item targets `#` by default, you can use `itemRender` slot to make a vue-router Link.

## Semantic DOM

| _semantic | demo/_semantic.md |
