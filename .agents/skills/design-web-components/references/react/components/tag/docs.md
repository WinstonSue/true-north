---
title: "Tag"
description: "Used for marking and categorization."
---

## When To Use

- It can be used to tag by dimension or property.

- When categorizing.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Colorful Tag | demo/colorful.md |
| Add & Remove Dynamically | demo/control.md |
| Checkable | demo/checkable.md |
| Icon | demo/icon.md |
| Status Tag | demo/status.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Tag

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| closeIcon | Custom close icon. 5.7.0: close button will be hidden when setting to `null` or `false` | ReactNode | false | 4.4.0 | 5.14.0 |
| color | Color of the Tag | string | `default` when `variant="solid"` | `solid` default color: 6.4.0 | × |
| disabled | Whether the tag is disabled | boolean | false | 6.0.0 | × |
| href | The address to jump when clicking, when this property is specified, the `tag` component will be rendered as an `<a>` tag | string | - | 6.0.0 | × |
| icon | Set the icon of tag | ReactNode | - |  | × |
| onClose | Callback executed when tag is closed (can be prevented by `e.preventDefault()`) | (e: React.MouseEvent<HTMLElement, MouseEvent>) => void | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| target | Same as target attribute of a, works when href is specified | string | - | 6.0.0 | × |
| variant | Variant of the tag | `'filled' \| 'solid' \| 'outlined'` | `'filled'` | 6.0.0 | 6.0.0 |

### Tag.CheckableTag

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| checked | Checked status of Tag | boolean | false |  |
| icon | Set the icon of tag | ReactNode | - | 5.27.0 |
| onChange | Callback executed when Tag is checked/unchecked | (checked) => void | - |  |

### Tag.CheckableTagGroup

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-group), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-group), string> | - |  |
| defaultValue | Initial value | `string \| number \| Array<string \| number> \| null` | - |  |
| disabled | Disable check/uncheck | `boolean` | - |  |
| multiple | Multiple select mode | `boolean` | - |  |
| options | Option list. Object options support per-item `className` and `style`. | `Array<{ className?: string; label: ReactNode; style?: CSSProperties; value: string \| number } \| string \| number>` | - | `className` and `style`: 6.4.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-group), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-group), CSSProperties> | - |  |
| value | Value of checked tag(s) | `string \| number \| Array<string \| number> \| null` | - |  |
| onChange | Callback when Tag is checked/unchecked | `(value: string \| number \| Array<string \| number> \| null) => void` | - |  |

## Semantic DOM

### Tag

See `demo/_semantic.md`.

### Tag.CheckableTagGroup {#semantic-group}

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
