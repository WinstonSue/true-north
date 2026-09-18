---
title: "Skeleton"
description: "Provide a placeholder while you wait for content to load, or to visualize content that doesn't exist yet."
---

## When To Use

- When a resource needs long time to load.
- When the component contains lots of information, such as List or Card.
- Only works when loading data for the first time.
- Could be replaced by Spin in any situation, but can provide a better user experience.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Complex combination | demo/complex.md |
| Active Animation | demo/active.md |
| Button/Avatar/Input/Image/Node | demo/element.md |
| Contains sub component | demo/children.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |
|  semantic element | demo/_semantic_element.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Common API

<embed src="./shared/sharedProps.en-US.md"></embed>

### Skeleton

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false |  | × |
| avatar | Show avatar placeholder | boolean \| [SkeletonAvatar](#skeletonavatar) | false |  | × |
| loading | Display the skeleton when true | boolean | - |  | × |
| paragraph | Show paragraph placeholder | boolean \| [SkeletonParagraphProps](#skeletonparagraphprops) | true |  | × |
| round | Show paragraph and title radius when true | boolean | false |  | × |
| title | Show title placeholder | boolean \| [SkeletonTitleProps](#skeletontitleprops) | true |  | × |

#### SkeletonTitleProps

| Property | Description            | Type             | Default |
| -------- | ---------------------- | ---------------- | ------- |
| width    | Set the width of title | number \| string | -       |

#### SkeletonParagraphProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Set the row count of paragraph | number | - |
| width | Set the width of paragraph. When width is an Array, it can set the width of each row. Otherwise only set the last row width | number \| string \| Array&lt;number \| string> | - |

### Skeleton.Avatar

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show animation effect, only valid when used avatar independently | boolean | false |
| shape | Set the shape of avatar | `circle` \| `square` | `circle` |
| size | Set the size of avatar | number \| `large` \| `medium` \| `small` | `medium` |

### Skeleton.Button

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| active | Show animation effect | boolean | false |  |
| block | Option to fit button width to its parent width | boolean | false | 4.17.0 |
| shape | Set the shape of button | `circle` \| `round` \| `square` \| `default` | - |  |
| size | Set the size of button | `large` \| `medium` \| `small` | `medium` |  |

### Skeleton.Input

| Property | Description           | Type                           | Default  |
| -------- | --------------------- | ------------------------------ | -------- |
| active   | Show animation effect | boolean                        | false    |
| size     | Set the size of input | `large` \| `medium` \| `small` | `medium` |

## Semantic DOM

### Skeleton

See `demo/_semantic.md`.

### Skeleton.Element

See `demo/_semantic_element.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
