---
title: Spin
description: Used for the loading status of a page or a block.
---

## When To Use

- Use Spin for indeterminate or percent-based loading states. See `demo/basic.md` and `demo/percent.md`.
- Use nested, fullscreen, delay/debounce, tip, size, or custom indicator demos for different loading contexts. See `demo/nested.md`, `demo/fullscreen.md`, `demo/delay-and-debounce.md`, `demo/tip.md`, `demo/size.md`, and `demo/custom-indicator.md`.
- Prefer Skeleton when the final content structure is known and should be previewed.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Size | demo/size.md |
| Embedded mode | demo/nested.md |
| Customized description | demo/tip.md |
| Delay | demo/delay-and-debounce.md |
| Custom spinning indicator | demo/custom-indicator.md |
| Progress | demo/percent.md |
| Custom semantic dom styling | demo/style-class.md |
| Fullscreen | demo/fullscreen.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| spinning | Whether Spin is visible | boolean | true | - |
| size | The size of Spin, options: `small`, `medium` and `large` | SizeType | `medium` | - |
| description | Customize description content | VueNode | - | - |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number | - | - |
| indicator | The node of the spinning indicator | VueNode | - | - |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | - |
| percent | The progress percentage, when set to `auto`, it will be an indeterminate progress | number \| 'auto' | - | - |
| rootClass | Root container class | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | SpinClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | SpinStylesType | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Content to wrap with Spin | () =&gt; any | - |
| indicator | The node of the spinning indicator | () =&gt; any | - |
| description | Customize description content | () =&gt; any | - |

### Static Methods

- `Spin.setDefaultIndicator(indicator: VueNode)`

  You can define default spin element globally.

## Semantic DOM

| _semantic | demo/_semantic.md |
