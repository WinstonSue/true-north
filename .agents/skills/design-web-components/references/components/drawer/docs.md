---
title: Drawer
description: A panel that slides out from the edge of the screen.
---

## When To Use

- Use Drawer for secondary tasks, details, or forms that should slide over the current page without full navigation. See `demo/basic-right.md`.
- Use `Drawer.open` for regular imperatively created drawers that can be updated or destroyed by the returned instance. See `demo/open.md`.
- Use placement, size, mask, loading, or resizable options for different overlay layouts. See `demo/placement.md`, `demo/size.md`, `demo/mask.md`, `demo/loading.md`, and `demo/resizable.md`.
- Use Drawer forms or user profiles for contextual editing and inspection. See `demo/form-in-drawer.md` and `demo/user-profile.md`.
- When the design shows a bottom action area, use Flex inside the body. See `demo/drawer-bottom-actions.md` and [Content layout](#content-layout).
- Use hooks when the drawer lifecycle should be controlled from composition logic and needs current ConfigProvider context. See `demo/hooks.md`.
- Prefer Modal for short blocking decisions and full pages for complex multi-step tasks.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic-right.md |
| Imperative open | demo/open.md |
| Hooks usage | demo/hooks.md |
| Custom Placement | demo/placement.md |
| Resizable | demo/resizable.md |
| Loading | demo/loading.md |
| Extra Actions | demo/extra.md |
| Render in current dom | demo/render-in-current.md |
| Submit form in drawer | demo/form-in-drawer.md |
| Bottom actions layout | demo/drawer-bottom-actions.md |
| Preview drawer | demo/user-profile.md |
| Multi-level drawer | demo/multi-level-drawer.md |
| Preset size | demo/size.md |
| mask | demo/mask.md |
| Closable placement | demo/closable-placement.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - | - |
| classes | Customize class for each semantic structure inside the Drawer component. Supports object or function. | DrawerClassNamesType | - | - |
| closable | Whether to show a close button. Close defaults to the header end (top-right). Use `placement: 'start'` to move it before the title | boolean \| \{ closeIcon?: VueNode, disabled?: boolean, placement?: 'start' \| 'end' \} | true (placement: `'end'`) | - |
| closeIcon | Custom close icon | VueNode | - | - |
| destroyOnHidden | Whether to unmount child components on closing drawer or not | boolean | false | - |
| extra | Extra actions area at corner | VueNode | - | - |
| forceRender | Pre-render Drawer component forcibly | boolean | false | - |
| getContainer | Mounted node and display window for Drawer | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| loading | Show the Skeleton | boolean | false | - |
| mask | Mask effect | MaskType | true | - |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` | - |
| push | Nested drawers push behavior | boolean \| \{ distance: string \| number \} | \{ distance: 180 \} | - |
| resizable | Enable resizable by dragging | boolean \| [ResizableConfig](#resizableconfig) | - | - |
| rootClass | Root container class | string | - | - |
| rootStyle | Style of wrapper element which contains mask | CSSProperties | - | - |
| size | Preset size of drawer, default `378px` and large `736px`, or a custom number | 'default' \| 'large' \| number | 'default' | - |
| styles | Customize inline style for each semantic structure inside the Drawer component. Supports object or function. | DrawerStylesType | - | - |
| title | The title for Drawer | VueNode | - | - |
| open | Whether the Drawer dialog is visible or not, support `v-model:open` | boolean | false | - |
| zIndex | The `z-index` of the Drawer | number | 1000 | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | (open: boolean) => void | - |
| close | Callback when drawer is closed | (e: MouseEvent \| KeyboardEvent) => void | - |
| keydown | Keyboard keydown event | (e: KeyboardEvent) => void | - |
| keyup | Keyboard keyup event | (e: KeyboardEvent) => void | - |
| mouseenter | Mouse enter event | (e: MouseEvent) => void | - |
| mouseleave | Mouse leave event | (e: MouseEvent) => void | - |
| mouseover | Mouse over event | (e: MouseEvent) => void | - |
| click | Click event | (e: MouseEvent) => void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Title | () => any | - |
| extra | Extra actions | () => any | - |
| closeIcon | Custom close icon | () => any | - |
| default | Drawer content | () => any | - |

### Drawer.open()
`Drawer.open(config)` imperatively opens a regular Drawer. Use it when composition logic or non-template code needs to show drawer content without rendering a `ContextHolder`.

**Vue:** `config` supports Drawer props except controlled `open` and `onUpdate:open`, adds `content` as the Drawer body, and can receive `appContext` to specify the Vue app context used by the static Drawer.

**React:** `config` supports Drawer props except controlled `open`, adds `content` as the Drawer body (`ReactNode`). There is no `appContext`; static calls rely on `ConfigProvider.config` / `globalConfig` (prefix, iconPrefix, theme) and optional `holderRender`.

Static calls do not inherit the current component tree context by default. Use `Drawer.useDrawer()` / `useDrawer()` when the drawer needs current ConfigProvider context, or configure `ConfigProvider.config({ holderRender })` to wrap static overlays globally.

The returned instance contains:

- `destroy`: Close and destroy current Drawer.
- `update`: Update current Drawer. Supports object update and functional update.

### Drawer.useDrawer()

Use `Drawer.useDrawer()` (Vue) or `Drawer.useDrawer()` / `useDrawer()` (React) when you need to open a Drawer imperatively while still reading context from `ConfigProvider`. The created Drawer will get all context from where `ContextHolder` / `contextHolder` is rendered.


`drawer.open(config)` returns:

- `destroy`: Close and destroy current drawer.
- `update`: Update current drawer. Supports object update and functional update.

You can also import `useDrawer` directly from `@sue/design-web-vue` or `@sue/design-web-react`.

## Types

### DrawerFuncProps

`DrawerFuncProps` supports Drawer props except controlled `open` (and Vue `onUpdate:open`), and adds `content` as the Drawer body.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Drawer body content in imperative calls | VueNode \| ReactNode | - | - |

### DrawerOpenProps

`DrawerOpenProps` extends `DrawerFuncProps`. On Vue it additionally supports `appContext` to specify the Vue app context used by the static Drawer. On React it is the same as `DrawerFuncProps` (no `appContext`).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| appContext | Vue only: app context used by the static Drawer | AppContext | - | - |

### ResizableConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onResizeStart | Callback when resize starts | () => void | - | - |
| onResize | Callback during resizing | (size: number) => void | - | - |
| onResizeEnd | Callback when resize ends | () => void | - | - |

## Content layout

Drawer body has **no default padding**. Apply padding on inner content containers.

- **`#extra`**: header-corner actions only. Do not use for bottom action areas.
- **Bottom action area**: Drawer has no `footer` slot. When the design shows bottom actions with scrollable content, wrap `#default` with `Flex vertical container="full"` → scrollable `container="fill"` + fixed `container="fixed"` for actions. Map action controls per design (Button, ButtonGroup, Space, etc.). See `demo/drawer-bottom-actions.md` and the `layout-flex` scenario in `design-web-scenarios`.

## Semantic DOM 
| _semantic | demo/_semantic.md |
