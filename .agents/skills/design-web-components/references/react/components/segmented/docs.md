---
title: "Segmented"
description: "Display multiple options and allow users to select a single option."
---

## When To Use

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Vertical Direction | demo/vertical.md |
| Block Segmented | demo/block.md |
| Round shape | demo/shape.md |
| Disabled | demo/disabled.md |
| Custom Render | demo/custom.md |
| Dynamic | demo/dynamic.md |
| Three sizes of Segmented | demo/size.md |
| With Icon | demo/with-icon.md |
| With Icon only | demo/icon-only.md |
| With name | demo/with-name.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> This component is available since `antd@4.20.0`

### Segmented

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  | × |
| classNames | Customize class for each semantic structure inside the Segmented component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| defaultValue | Default selected value | string \| number | Value of first item in `options` |  | × |
| disabled | Disable all segments | boolean | false |  | × |
| onChange | The callback function that is triggered when the state changes | function(value: string \| number) |  |  | × |
| options | Set children optional | string\[] \| number\[] \| SegmentedItemType\[] | [] |  | × |
| orientation | Orientation | `horizontal` \| `vertical` | `horizontal` |  | × |
| size | The size of the Segmented. | `large` \| `medium` \| `small` | `medium` |  | × |
| styles | Customize inline style for each semantic structure inside the Segmented component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| vertical | Orientation. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | `false` | 5.21.0 | × |
| value | Currently selected value | string \| number |  |  | × |
| shape | shape of Segmented | `default` \| `round` | `default` | 5.24.0 | × |
| name | The `name` property of all `input[type="radio"]` children. if not set, it will fallback to a randomly generated name | string |  | 5.23.0 | × |

### SegmentedItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disabled state of segmented item | boolean | false |  |
| className | The additional css class | string | - |  |
| icon | Display icon for Segmented item | ReactNode | - |  |
| label | Display text for Segmented item | ReactNode | - |  |
| tooltip | tooltip for Segmented item | string \| [TooltipProps](../tooltip/index.en-US.md#api) | - |  |
| value | Value for Segmented item | string \| number | - |  |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
