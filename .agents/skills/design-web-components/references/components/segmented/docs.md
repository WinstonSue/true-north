---
title: Segmented
description: Display multiple options and allow users to select a single option.
---

## When To Use

- Use Segmented for compact switching between a small number of peer modes or views. See `demo/basic.md`.
- Use icon, name, vertical, block, size, disabled, or dynamic demos for mode switchers. See `demo/with-icon.md`, `demo/with-name.md`, `demo/vertical.md`, `demo/block.md`, `demo/size.md`, `demo/disabled.md`, and `demo/dynamic.md`.
- Prefer Tabs when each option controls substantial page content and needs tab semantics.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Vertical Direction | demo/vertical.md |
| Block Segmented | demo/block.md |
| Round shape | demo/shape.md |
| Custom Render | demo/custom.md |
| Dynamic | demo/dynamic.md |
| Disabled | demo/disabled.md |
| Three sizes of Segmented | demo/size.md |
| With Icon | demo/with-icon.md |
| With Icon only | demo/icon-only.md |
| With name | demo/with-name.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  |
| defaultValue | Default selected value | string \| number |  |  |
| disabled | Disable all segments | boolean | false |  |
| gap | Gap between segmented items | number \| string | `4px` |  |
| options | Set children optional | string\[] \| number\[] \| SegmentedItemType\[] | [] |  |
| orientation | Orientation | `horizontal` \| `vertical` | `horizontal` |  |
| size | The size of the Segmented. | `large` \| `medium` \| `small` | `medium` |  |
| vertical | Orientation，Simultaneously existing with `orientation`, `orientation` takes priority | boolean | `false` | - |
| value | Currently selected value, support `v-model:value` | string \| number |  |  |
| shape | shape of Segmented | `default` \| `round` | `default` | - |
| name | The `name` property of all `input[type="radio"]` children. if not set, it will fallback to a randomly generated name | string |  |- |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes  | function(value: string \| number) | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| iconRender | icon render slot | (option: SegmentedLabeledOption) =&gt; any | - |
| labelRender | label render slot | (option: SegmentedLabeledOption) =&gt; any | - |

## Types

### SegmentedItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Disabled state of segmented item | boolean | false |  |
| class | The additional css class | string | - |  |
| icon | Display icon for Segmented item | VueNode | - |  |
| label | Display text for Segmented item | VueNode | - |  |
| tooltip | tooltip for Segmented item | string \| [TooltipProps](../tooltip#api) | - |  |
| value | Value for Segmented item | string \| number | - |  |

## Semantic DOM

| _semantic | demo/_semantic.md |
