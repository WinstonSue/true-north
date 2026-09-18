---
title: Space
description: Set components spacing.
---

## When To Use

- Use Space to apply consistent gaps between inline or stacked elements. See `demo/basic.md`.
- Use vertical, wrap, align, size, or separator demos for common spacing patterns. See `demo/vertical.md`, `demo/wrap.md`, `demo/align.md`, `demo/size.md`, and `demo/separator.md`.
- Use Space.Compact for connected controls such as input-button groups. See `demo/compact.md`, `demo/compact-buttons.md`, and `demo/compact-button-vertical.md`.
- Prefer Flex or Grid when layout needs alignment, wrapping strategy, or responsive spans beyond spacing.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Vertical Space | demo/vertical.md |
| Space Size | demo/size.md |
| Align | demo/align.md |
| Wrap | demo/wrap.md |
| Separator | demo/separator.md |
| Compact Mode for form component | demo/compact.md |
| Button Compact Mode | demo/compact-buttons.md |
| Vertical Compact Mode | demo/compact-button-vertical.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Space

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \| `center` \| `baseline` | - | 4.2.0 |
| orientation | The space direction | `vertical` \| `horizontal` | `horizontal` | - |
| separator | Set separator | VueNode | - | - |
| size | The space size | [Size](#size) \| [[Size](#size), [Size](#size)] | `small` | 4.1.0 \| Array: 4.9.0 |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false | 4.9.0 |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| separator | Set separator | () =&gt; VueNode | - |

### Size

`'small' | 'medium' | 'large' | number`

### SpaceCompact

Use Space.Compact when child form components are compactly connected and the border is collapsed. The supported components are:

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent's width | boolean | false | 4.24.0 |
| orientation | Set direction of layout | `vertical` \| `horizontal` | `horizontal` | - |
| size | Set child component size | `large` \| `medium` \| `small` | `medium` | 4.24.0 |
| vertical | Orientation, Simultaneously configure with `orientation` and prioritize `orientation` | boolean | false | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
