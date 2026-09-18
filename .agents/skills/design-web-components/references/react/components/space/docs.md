---
title: "Space"
description: "Set components spacing."
---

## When To Use

- Avoid components clinging together and set a unified space.
- Use Space.Compact when child form components are compactly connected and the border is collapsed (After version `antd@4.24.0` Supported).

### Difference with Flex component

- Space is used to set the spacing between inline elements. It will add a wrapper element for each child element for inline alignment. Suitable for equidistant arrangement of multiple child elements in rows and columns.
- Flex is used to set the layout of block-level elements. It does not add a wrapper element. Suitable for layout of child elements in vertical or horizontal direction, and provides more flexibility and control.

## Demos

| Demo | Path |
| --- | --- |
| Vertical Space | demo/vertical.md |
| Space Size | demo/size.md |
| Align | demo/align.md |
| Wrap | demo/wrap.md |
| separator | demo/separator.md |
| Compact Mode for form component | demo/compact.md |
| Button Compact Mode | demo/compact-buttons.md |
| Vertical Compact Mode | demo/compact-button-vertical.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Space

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \|`center` \|`baseline` | - | 4.2.0 | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props: SpaceProps })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.6.0 |
| orientation | The space direction | `vertical` \| `horizontal` | `horizontal` |  | × |
| size | The space size | [Size](#size) \| [Size\[\]](#size) | `small` | 4.1.0 \| Array: 4.9.0 | 5.6.0 |
| separator | Set separator | ReactNode | - | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props: SpaceProps })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.6.0 |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - | × |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false | 4.9.0 | × |

### Size

`'small' | 'middle' | 'large' | number`

### Space.Compact

Use Space.Compact when child form components are compactly connected and the border is collapsed. The supported components are：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false | 4.24.0 |
| orientation | Set direction of layout | `vertical` \| `horizontal` | `horizontal` |  |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |
| size | Set child component size | `large` \| `medium` \| `small` | `medium` | 4.24.0 |

### Space.Addon

> This component is available since `antd@5.29.0`.

Used to create custom cells in compact layouts.

| Property | Description    | Type      | Default | Version |
| -------- | -------------- | --------- | ------- | ------- |
| children | Custom content | ReactNode | -       | 5.29.0  |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
