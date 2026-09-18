---
title: "Spin"
description: "Used for the loading status of a page or a block."
---

## When To Use

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Size | demo/size.md |
| Embedded mode | demo/nested.md |
| Customized description | demo/tip.md |
| Custom spinning indicator | demo/custom-indicator.md |
| Progress | demo/percent.md |
| Custom semantic dom styling | demo/style-class.md |
| Fullscreen | demo/fullscreen.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| delay | Specifies a delay in milliseconds for loading state (prevent flush) | number (milliseconds) | - |  | × |
| description | Customize description content | ReactNode | - | 6.3.0 | × |
| fullscreen | Display a backdrop with the `Spin` component | boolean | false | 5.11.0 | × |
| indicator | React node of the spinning indicator | ReactNode | - |  | 5.20.0 |
| percent | The progress percentage, when set to `auto`, it will be an indeterminate progress | number \| 'auto' | - | 5.18.0 | × |
| size | The size of Spin, options: `small`, `medium` and `large` | string | `medium` |  | × |
| spinning | Whether Spin is visible | boolean | true |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |

### Static Method

- `Spin.setDefaultIndicator(indicator: ReactNode)`

  You can define default spin element globally.

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
