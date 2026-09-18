---
title: "Masonry"
description: ""
---

## When To Use

- When displaying images or cards with irregular heights
- When content needs to be evenly distributed in columns
- When column count needs to be responsive

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Responsive | demo/responsive.md |
| Image | demo/image.md |
| Dynamic | demo/dynamic.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

## Masonry

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - | 6.0.0 | 6.0.0 |
| columns | Number of columns, can be a fixed value or a responsive configuration | `number \| { xs?: number; sm?: number; md?: number }` | `3` |  | × |
| fresh | Whether to continuously monitor the size changes of child items | `boolean` | `false` |  | × |
| gutter | Spacing, can be a fixed value, responsive configuration, or a configuration for horizontal and vertical spacing | [Gap](#gap) \| \[[Gap](#gap), [Gap](#gap)\] | `0` |  | × |
| items | Masonry items | [MasonryItem](#masonryitem)[] | - |  | × |
| itemRender | Custom item rendering function | `(item: MasonryItem) => React.ReactNode` | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 6.0.0 | 6.0.0 |
| onLayoutChange | Callback for column sorting changes | `({ key: React.Key; column: number }[]) => void` | - |  | × |

### MasonryItem

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| children | Custom display content, takes precedence over `itemRender` | `React.ReactNode` | - |
| column | Specifies the column to which the item belongs | `number` | - |
| data | Custom data storage | `T` | - |
| height | Height of the item | `number` | - |
| key | Unique identifier for the item | `string` \| `number` | - |

### Gap

`Gap` represents the spacing between items. It can either be a fixed value or a responsive configuration.

```ts
type Gap = undefined | number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>;
```

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
