---
title: "Drawer"
description: "A panel that slides out from the edge of the screen."
---

## When To Use

A Drawer is a panel that is typically overlaid on top of a page and slides in from the side. It contains a set of information or actions. Since the user can interact with the Drawer without leaving the current page, tasks can be achieved more efficiently within the same context.

- Use a Form to create or edit a set of information.
- Processing subtasks. When subtasks are too heavy for a Popover and we still want to keep the subtasks in the context of the main task, Drawer comes very handy.
- When the same Form is needed in multiple places.

> Notes for developers
>
> Since the `5.17.0`, we provided the `loading` prop by the Spin. However, since the `5.18.0` version, we have fixed this design error and replaced the Spin with the Skeleton, and also modified the type of `loading` prop, which can only accept `boolean` type.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic-right.md |
| Custom Placement | demo/placement.md |
| Resizable | demo/resizable.md |
| Loading | demo/loading.md |
| Extra Actions | demo/extra.md |
| Render in current dom | demo/render-in-current.md |
| Submit form in drawer | demo/form-in-drawer.md |
| Preview drawer | demo/user-profile.md |
| Multi-level drawer | demo/multi-level-drawer.md |
| Preset size | demo/size.md |
| mask | demo/mask.md |
| Closable placement | demo/closable-placement.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| afterOpenChange | Callback after the animation ends when switching drawers | function(open) | - |  | × |
| className | Config Drawer Panel className. Use `rootClassName` if want to config top DOM style | string | - |  | 5.7.0 |
| classNames | Customize class for each semantic structure inside the Drawer component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.10.0 |
| closable | Whether to show a close button. The position can be configured with `placement` | boolean \| { closeIcon?: React.ReactNode; disabled?: boolean; placement?: 'start' \| 'end' } | true | placement: 5.28.0 | 5.15.0, placement: 6.1.1 |
| destroyOnHidden | Whether to unmount child components on closing drawer or not | boolean | false | 5.25.0 | × |
| extra | Extra actions area at corner | ReactNode | - | 4.17.0 | × |
| forceRender | Pre-render Drawer component forcibly | boolean | false |  | × |
| focusable | Configuration for focus management in the Drawer | `{ trap?: boolean, focusTriggerAfterClose?: boolean }` | - | 6.2.0 | 6.4.0 |
| getContainer | mounted node and display window for Drawer | HTMLElement \| () => HTMLElement \| Selectors \| false | body |  | × |
| keyboard | Whether support press esc to close | boolean | true |  | × |
| loading | Show the Skeleton | boolean | false | 5.17.0 | × |
| mask | Mask effect | boolean \| `{ enabled?: boolean, blur?: boolean, closable?: boolean }` | true | mask.closable: 6.3.0 | 6.0.0, mask.closable: 6.3.0 |
| maxSize | Maximum size (width or height depending on `placement`) when resizable | number | - | 6.0.0 | × |
| open | Whether the Drawer dialog is visible or not | boolean | false |  | × |
| placement | The placement of the Drawer | `top` \| `right` \| `bottom` \| `left` | `right` |  | × |
| push | Nested drawers push behavior | boolean \| { distance: string \| number } | { distance: 180 } | 4.5.0+ | × |
| resizable | Enable resizable by dragging | boolean \| [ResizableConfig](#resizableconfig) | - | boolean: 6.1.0 | × |
| rootStyle | Style of wrapper element which **contains mask** compare to `style` | CSSProperties | - |  | × |
| size | preset size of drawer, default `378px` and large `736px`, or a custom number | 'default' \| 'large' \| number \| string | 'default' | 4.17.0, string: 6.2.0 | × |
| style | Style of Drawer panel. Use `styles.body` if want to config body only | CSSProperties | - |  | 5.7.0 |
| styles | Customize inline style for each semantic structure inside the Drawer component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.10.0 |
| title | The title for Drawer | ReactNode | - |  | × |
| zIndex | The `z-index` of the Drawer | number | 1000 |  | × |
| onClose | Specify a callback that will be called when a user clicks mask, close button or Cancel button | function(e) | - |  | × |
| drawerRender | Custom drawer content render | (node: ReactNode) => ReactNode | - | 5.18.0 | × |

### ResizableConfig

| Property      | Description                 | Type                   | Default | Version |
| ------------- | --------------------------- | ---------------------- | ------- | ------- |
| onResizeStart | Callback when resize starts | () => void             | -       | 6.0.0   |
| onResize      | Callback during resizing    | (size: number) => void | -       | 6.0.0   |
| onResizeEnd   | Callback when resize ends   | () => void             | -       | 6.0.0   |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
