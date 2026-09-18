---
title: "Mentions"
description: "Used to mention someone or something in an input."
---

## When To Use

When you need to mention someone or something.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Size | demo/size.md |
| Variants | demo/variant.md |
| Asynchronous loading | demo/async.md |
| With Form | demo/form.md |
| Customize Trigger Token | demo/prefix.md |
| disabled or readOnly | demo/readonly.md |
| Placement | demo/placement.md |
| Status | demo/status.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Mention

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Whether to show a clear icon to remove mentions content | boolean \| { clearIcon?: ReactNode, disabled?: boolean } | false | 5.13.0, disabled: 6.4.0 | 6.4.0 |
| autoSize | Textarea height autosize feature, can be set to true \| false or an object { minRows: 2, maxRows: 6 } | boolean \| object | false |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| defaultValue | Default value | string | - |  | × |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean | - |  | × |
| getPopupContainer | Set the mount HTML node for suggestions | () => HTMLElement | - |  | × |
| notFoundContent | Set mentions content when not match | ReactNode | `Not Found` |  | × |
| placement | Set popup placement | `top` \| `bottom` | `bottom` |  | × |
| prefix | Set trigger prefix keyword | string \| string\[] | `@` |  | × |
| split | Set split string before and after selected mention | string | ` ` |  | × |
| size | The size of the input box | `large` \| `medium` \| `small` | - |  | × |
| status | Set validation status | 'error' \| 'warning' \| 'success' \| 'validating' | - | 4.19.0 | × |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void | - |  | × |
| value | Set value of mentions | string | - |  | × |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 | 5.19.0 |
| onBlur | Trigger when mentions lose focus | () => void | - |  | × |
| onChange | Trigger when value changed | (text: string) => void | - |  | × |
| onClear | Callback when click the clear button | () => void | - | 5.20.0 | × |
| onFocus | Trigger when mentions get focus | () => void | - |  | × |
| onResize | The callback function that is triggered when textarea resize | function({ width, height }) | - |  | × |
| onSearch | Trigger when prefix hit | (text: string, prefix: string) => void | - |  | × |
| onSelect | Trigger when user select the option | (option: OptionProps, prefix: string) => void | - |  | × |
| onPopupScroll | Trigger when mentions scroll | (e: Event) => void | - | 5.23.0 | × |
| options | Option Configuration | [Options](#option) | \[] | 5.1.0 | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |

### Mention methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### Option

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value inserted when selected | string | - |
| label | Title of the option | React.ReactNode | - |
| key | The key value of the option | string | - |
| disabled | Optional | boolean | - |
| className | className | string | - |
| style | The style of the option | React.CSSProperties | - |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
