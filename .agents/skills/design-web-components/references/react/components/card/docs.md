---
title: "Card"
description: "A container for displaying information."
---

## When To Use

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## Demos

| Demo | Path |
| --- | --- |
| Basic card | demo/basic.md |
| No border | demo/border-less.md |
| Simple card | demo/simple.md |
| Customized content | demo/flexible-content.md |
| Card in column | demo/in-column.md |
| Loading card | demo/loading.md |
| Grid card | demo/grid-card.md |
| Inner card | demo/inner.md |
| With tabs | demo/tabs.md |
| Support more content configuration | demo/meta.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

```jsx
<Card title="Card title">Card content</Card>
```

### Size

When `size` is omitted, Card uses `medium` spacing.

| Size | Body padding | Header padding | Header min height |
| --- | --- | --- | --- |
| `small` | `8px 12px` | `0 12px` | `38px` |
| `medium` (default) | `12px 16px` | `0 16px` | `48px` |
| `large` | `16px 24px` | `0 24px` | `56px` |

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| actions | The action list, shows at the bottom of the Card | Array&lt;ReactNode> | - |  | × |
| activeTabKey | Current TabPane's key | string | - |  | × |
| variant | Variants of Card | `outlined` \| `borderless` | `outlined` | 5.24.0 | 5.24.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.14.0 |
| cover | Card cover | ReactNode | - |  | × |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set | string | `The key of first tab` |  | × |
| extra | Content to render in the top-right corner of the card | ReactNode | - |  | × |
| hoverable | Lift up when hovering card | boolean | false |  | × |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false |  | × |
| size | Size of card | `small` \| `medium` \| `large` | `medium` |  | × |
| tabBarExtraContent | Extra content in tab bar | ReactNode | - |  | × |
| tabList | List of TabPane's head | [TabItemType](../tabs/docs.md#tabitemtype)[] | - |  | × |
| tabProps | [Tabs](/components/tabs/#tabs) | - | - |  | × |
| title | Card title | ReactNode | - |  | × |
| type | Card style type, can be set to `inner` or not set | string | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.14.0 |
| onTabChange | Callback when tab is switched | (key) => void | - |  | × |

### Card.Grid

| Property  | Description                     | Type    | Default | Version |
| --------- | ------------------------------- | ------- | ------- | ------- |
| hoverable | Lift up when hovering card grid | boolean | true    |         |

### Card.Meta

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| avatar | Avatar or icon | ReactNode | - |  | × |
| description | Description content | ReactNode | - |  | × |
| title | Title content | ReactNode | - |  | × |

## Semantic DOM

### Card

See `demo/_semantic.md`.

### Card.Meta

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
