---
title: "InputNumber"
description: "Enter a number within certain range with the mouse or keyboard."
---

## When To Use

When a numeric value needs to be provided.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Sizes | demo/size.md |
| Disabled | demo/disabled.md |
| High precision decimals | demo/digit.md |
| Formatter | demo/formatter.md |
| Keyboard | demo/keyboard.md |
| Wheel | demo/change-on-wheel.md |
| Variants | demo/variant.md |
| Spinner | demo/spinner.md |
| Out of range | demo/out-of-range.md |
| Prefix / Suffix | demo/presuffix.md |
| Status | demo/status.md |
| Focus | demo/focus.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| changeOnBlur | Trigger `onChange` when blur. e.g. reset value in range by blur | boolean | true | 5.11.0 | × |
| changeOnWheel | Allows control with mouse wheel | boolean | - | 5.14.0 | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | 6.0.0 | 6.0.0 |
| controls | Whether to show `+-` controls, or set custom arrow icons | boolean \| { upIcon?: React.ReactNode; downIcon?: React.ReactNode; } | - |  | × |
| decimalSeparator | Decimal separator | string | - | - | × |
| placeholder | Placeholder | string | - |  | × |
| defaultValue | The initial value | number | - | - | × |
| disabled | If the input is disabled | boolean | false | - | × |
| formatter | Specifies the format of the value presented | function(value: number \| string, info: { userTyping: boolean, input: string }): string | - |  | × |
| keyboard | If keyboard behavior is enabled | boolean | true |  | × |
| max | The max value | number | [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) | - | × |
| min | The min value | number | [Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) | - | × |
| parser | Specifies the value extracted from formatter | function(string): number | - | - | × |
| precision | The precision of input value. Will use `formatter` when config of `formatter` | number | - | - | × |
| readOnly | If the input is readonly | boolean | false | - | × |
| status | Set validation status | 'error' \| 'warning' | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 6.0.0 | 6.0.0 |
| prefix | The prefix icon for the Input | ReactNode | - |  | × |
| suffix | The suffix icon for the Input | ReactNode | - | 5.20.0 | × |
| size | The height of input box | `large` \| `medium` \| `small` | - | - | × |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal | number \| string | 1 | - | × |
| stringMode | Set value as string to support high precision decimals. Will return string value by `onChange` | boolean | false | 4.13.0 | × |
| mode | Show input or spinner | `'input' \| 'spinner'` | `'input'` |  | × |
| value | The current value of the component | number | - | - | × |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 | 5.19.0 |
| onChange | The callback triggered when the value is changed | function(value: number \| string \| null) | - | - | × |
| onPressEnter | The callback function that is triggered when Enter key is pressed | function(e) | - | - | × |
| onStep | The callback function that is triggered when click up or down buttons / Keyboard / Wheel | (value: number, info: { offset: number, type: 'up' \| 'down', emitter: 'handler' \| 'keydown' \| 'wheel' }) => void | - |  | × |

## Ref

| Name | Description | Type | Version |
| --- | --- | --- | --- |
| blur() | Remove focus | - |  |
| focus() | Get focus | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | cursor - 5.22.0 |
| nativeElement | The native DOM element | - | 5.17.3 |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## Notes

Per issues [#21158](https://github.com/yuce-design/yuce-design/issues/21158), [#17344](https://github.com/yuce-design/yuce-design/issues/17344), [#9421](https://github.com/yuce-design/yuce-design/issues/9421), and [documentation about inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#Using_number_inputs), it appears this community does not support native inclusion of the `type="number"` in the `<Input />` attributes, so please feel free to include it as needed, and be aware that it is heavily suggested that server side validation be utilized, as client side validation can be edited by power users.

## FAQ

### Why `value` can exceed `min` or `max` in control? {#faq-controlled-range}

Developer handle data by their own in control. It will make data out of sync if InputNumber changes display value. It also cause potential data issues when use in form.

### Why dynamic change `min` or `max` which makes `value` out of range will not trigger `onChange`? {#faq-dynamic-range-change}

`onChange` is user trigger event. Auto-triggering would prevent form libraries from detecting the data modification source.

### Why `onBlur` or other event can not get correct value? {#faq-onblur-value}

InputNumber's value is wrapped by internal logic. The `event.target.value` you get from `onBlur` or other event is the DOM element's `value` instead of the actual value of InputNumber. For example, if you change the display format through `formatter` or `decimalSeparator`, you will get the formatted string in the DOM. You should always get the current value through `onChange`.

### Why `changeOnWheel` unable to control whether the mouse scroll wheel changes value? {#faq-change-on-wheel}

> The use of the `type` attribute is deprecated

The InputNumber component allows you to use all the attributes of the input element and ultimately pass them to the input element, This attribute will also be added to the input element when you pass in `type='number'`, which will activate native behavior (allowing the mouse wheel to change the value), As a result `changeOnWheel` cannot control whether the mouse wheel changes the value.
