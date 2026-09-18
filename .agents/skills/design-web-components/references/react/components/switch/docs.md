---
title: "Switch"
description: "Used to toggle between two states."
---

## When To Use

- If you need to represent the switching between two states or on-off state.
- The difference between `Switch` and `Checkbox` is that `Switch` will trigger a state change directly when you toggle it, while `Checkbox` is generally used for state marking, which should work in conjunction with submit operation.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Disabled | demo/disabled.md |
| Text & icon | demo/text.md |
| Two sizes | demo/size.md |
| Loading | demo/loading.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| checked | Determine whether the Switch is checked | boolean | false |  | × |
| checkedChildren | The content to be shown when the state is checked | ReactNode | - |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| defaultChecked | Whether to set the initial state | boolean | false |  | × |
| defaultValue | Alias for `defaultChecked` | boolean | - | 5.12.0 | × |
| disabled | Disable switch | boolean | false |  | × |
| loading | Loading state of switch | boolean | false |  | × |
| size | The size of the Switch, options: `medium` `small` | `'medium'` \| `'small'` | `medium` |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| unCheckedChildren | The content to be shown when the state is unchecked | ReactNode | - |  | × |
| value | Alias for `checked` | boolean | - | 5.12.0 | × |
| onChange | Trigger when the checked state is changing | function(checked: boolean, event: Event) | - |  | × |
| onClick | Trigger when clicked | function(checked: boolean, event: Event) | - |  | × |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### Why not work in Form.Item? {#faq-binding-data}

Form.Item default bind value to `value` property, but Switch value property is `checked`. You can use `valuePropName` to change bind property.

```tsx | pure
<Form.Item name="fieldA" valuePropName="checked">
  <Switch />
</Form.Item>
```
