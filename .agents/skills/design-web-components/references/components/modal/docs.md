---
title: Modal
description: Display a modal dialog box, providing a title and content area.
---

## When To Use

- Use Modal for blocking decisions, focused forms, or short workflows that must stay in context. See `demo/basic.md`.
- Use `Modal.open` for regular imperatively created modals that can be updated or destroyed by the returned instance. See `demo/open.md`.
- Use confirm, async, loading, footer render, or manual demos for confirmation and controlled flows. See `demo/confirm.md`, `demo/async.md`, `demo/loading.md`, `demo/footer-render.md`, and `demo/manual.md`.
- Use hooks when modal APIs need provider context. See `demo/hooks.md`.
- Use mask, width, position, or modal render demos to tune presentation. See `demo/mask.md`, `demo/width.md`, `demo/position.md`, and `demo/modal-render.md`.
- Prefer Drawer for non-blocking side tasks and Popconfirm for small inline confirmations.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Imperative open | demo/open.md |
| Asynchronously close | demo/async.md |
| mask | demo/mask.md |
| Loading | demo/loading.md |
| Customized Modal.method() footer | demo/footer-render.md |
| Use hooks to get context | demo/hooks.md |
| Internationalization | demo/locale.md |
| Manual to update destroy | demo/manual.md |
| To customize the position of modal | demo/position.md |
| Custom modal content render | demo/modal-render.md |
| To customize the width of modal | demo/width.md |
| Static Method | demo/static-info.md |
| Static confirmation | demo/confirm.md |
| destroy confirmation modal dialog | demo/confirm-router.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| afterOpenChange | Callback when the animation ends when Modal is turned on and off | (open: boolean) => void | - | - |
| centered | Centered Modal | boolean | false | - |
| classes | Customize class for each semantic structure inside the Modal component. Supports object or function. | ModalClassNamesType | - | - |
| closable | Whether a close (x) button is visible on top right or not | boolean \| [ClosableType](#closabletype) | true | - |
| closeIcon | Custom close icon. Close button will be hidden when setting to `null` or `false` | VueNode | &lt;X /> | - |
| destroyOnHidden | Whether to unmount child components on close | boolean | false | - |
| focusTriggerAfterClose | Whether need to focus trigger element after dialog is closed | boolean | true | - |
| forceRender | Force render Modal | boolean | false | - |
| focusable | Configuration for focus management in the Modal | `{ trap?: boolean, focusTriggerAfterClose?: boolean }` | - | - |
| getContainer | The mounted node for Modal but still display at fullscreen | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| loading | Show the skeleton | boolean | false | - |
| mask | Mask effect | boolean \| `{enabled?: boolean, blur?: boolean, closable?: boolean}` | true | mask.closable: 1.0.3 |
| modalRender | Custom modal content render | (node: any) => any | - | - |
| mousePosition | Set animation start position | MousePosition | - | - |
| open | Whether the modal dialog is visible or not, support `v-model:open` | boolean | false | - |
| styles | Customize inline style for each semantic structure inside the Modal component. Supports object or function. | ModalStylesType | - | - |
| title | The modal dialog's title | VueNode | - | - |
| transitionName | Transition name of dialog | string | - | - |
| maskTransitionName | Transition name of mask | string | - | - |
| width | Width of the modal dialog | string \| number \| Partial<Record<Breakpoint, string \| number>> | 520 | - |
| wrapClassName | The class name of the container of the modal dialog | string | - | - |
| wrapProps | Wrapper element props | Record<string, any> | - | - |
| zIndex | The `z-index` of the Modal | number | 1000 | - |

### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| cancel | Callback when the mask or close button is clicked | (e: MouseEvent) => void | - |

### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Modal content | () => any | - |
| title | Title | () => any | - |
| closeIcon | Custom close icon | () => any | - |
| modalRender | Custom modal content render | (node: any) => any | - |

### Note

- The state of Modal will be preserved at its component lifecycle by default, if you wish to open it with a brand new state every time, set `destroyOnHidden` on it.
- If you use Form in Modal, and need to clear fields when closing, set `<sue-form :preserve="false" />`.
- `Modal.method()` RTL mode only supports hooks usage.

### Modal.open()
`Modal.open(config)` imperatively opens a regular Modal. Use it when composition logic or non-template code needs to show modal content without confirmation dialog semantics. Unlike `Modal.confirm`, `Modal.info`, and other confirmation static methods, it does not render OK or Cancel buttons automatically.

`config` supports Modal props except controlled `open` and `onUpdate:open`, adds `content` as the default body, and can receive `appContext` to specify the Vue app context used by the static Modal. Static calls do not inherit the current component tree context by default. Use `Modal.useModal()` when the modal needs current ConfigProvider context, or configure `ConfigProvider.config({ holderRender })` to wrap static overlays globally.

The returned instance contains:

- `destroy`: Close and destroy current Modal.
- `update`: Update current Modal. Supports object update and functional update.

### Modal.method() 
There are five ways to display the information based on the content's nature:

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

The items listed above are all functions, expecting a settings object as parameter. The properties of the object are follows:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| autoFocusButton | Specify which button to autofocus | null \| `ok` \| `cancel` | `ok` | - |
| cancelButtonProps | The cancel button props | ButtonProps | - | - |
| cancelText | Text of the Cancel button with Modal.confirm | string | `Cancel` | - |
| centered | Centered Modal | boolean | false | - |
| class | Container class | string | - | - |
| closable | Whether a close (x) button is visible on top right of the confirm dialog or not | boolean \| [ClosableType](#closabletype) | false | - |
| closeIcon | Custom close icon | VueNode | - | - |
| content | Content | VueNode | - | - |
| footer | Footer content, set as `footer: null` when you don't need default buttons | VueNode \| (params: { originNode: VueNode, extra: { OkBtn: any, CancelBtn: any } }) => any | - | - |
| getContainer | Return the mount node for Modal | string \| HTMLElement \| (() => HTMLElement) \| false | document.body | - |
| icon | Custom icon | VueNode | &lt;CircleAlert /> | - |
| keyboard | Whether support press esc to close | boolean | true | - |
| mask | Mask effect | boolean \| [MaskType](#masktype) | true | - |
| okButtonProps | The ok button props | ButtonProps | - | - |
| okText | Text of the OK button | string | `OK` | - |
| okType | Button `type` of the OK button | LegacyButtonType | `primary` | - |
| style | Style of floating layer, typically used at least for adjusting the position | CSSProperties | - | - |
| title | Title | VueNode | - | - |
| type | Dialog type | `info` \| `success` \| `error` \| `warn` \| `warning` \| `confirm` | `confirm` | - |
| width | Width of the modal dialog | string \| number | 416 | - |
| wrapClassName | The class name of the container of the modal dialog | string | - | - |
| zIndex | The `z-index` of the Modal | number | 1000 | - |
| onCancel | Click to onCancel callback, the parameter is the closing function | (close?: () => void) => void | - | - |
| onOk | Click to onOk callback, the parameter is the closing function | (close?: () => void) => void | - | - |

All the `Modal.method`s will return a reference, and then we can update and close the modal dialog by the reference.

### ClosableType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Specify a function that will be called when modal is closed completely | () => void | - | - |
| closeIcon | Custom close icon | VueNode | undefined | - |
| disabled | Whether disabled close icon | boolean | false | - |
| onClose | Trigger when modal close | () => void | undefined | - |

### MaskType 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| enabled | Do you want to enable masking | boolean | true | - |
| blur | Whether to enable virtualization effect | boolean | false | - |
| closable | Whether to close the modal dialog when the mask is clicked, When using functional calls, the default value is `false` | boolean | true | - |

```ts
const modal = Modal.info()

modal.update({
  title: 'Updated title',
  content: 'Updated content',
})

modal.update(prevConfig => ({
  ...prevConfig,
  title: `${prevConfig.title} (New)`,
}))

modal.destroy()
```

- `Modal.destroyAll`

`Modal.destroyAll()` could destroy all confirmation modal dialogs. Usually, you can use it in router change event to destroy confirm modal dialog automatically.

### Modal.useModal()
Use `Modal.useModal` when modal APIs need ConfigProvider or component-tree context. Render the returned context holder inside the provider subtree. See `demo/hooks.md`.

`modal.confirm` returns `destroy`, `update`, and hook-only `then` helpers.

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why content not update when Modal closed? 
Modal will use memo to avoid content jumping when closed. Also, if you use Form in Modal, you can reset `initialValues` by calling `resetFields` in effect.

### Why I can not access context in Modal.xxx? 
Modal static methods create an instance without context connection. When you need context info (like ConfigProvider context), you can use `Modal.useModal` to get `modal` instance and `contextHolder` node.

If static `Modal.open` or `Modal.xxx` methods must read locale, theme, or other ConfigProvider settings, configure global `holderRender` once. See ConfigProvider `holderRender` docs and `demo/hooks.md`.
