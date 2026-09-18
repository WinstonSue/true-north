---
title: "Empty"
description: "Empty state placeholder."
---

## When To Use

- When there is no data provided, display for friendly tips.
- User tutorial to create something in fresh new situation.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Choose image | demo/simple.md |
| Customize | demo/customize.md |
| ConfigProvider | demo/config-provider.md |
| Custom semantic dom styling | demo/style-class.md |
| No description | demo/description.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

```jsx
<Empty>
  <Button>Create</Button>
</Empty>
```

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.23.0 |
| description | Customize description | ReactNode | - |  | × |
| image | Customize image. Will treat as image url when string provided | ReactNode | `Empty.PRESENTED_IMAGE_DEFAULT` |  | 5.27.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.23.0 |

## Built-in images

- Empty.PRESENTED_IMAGE_SIMPLE

  <div class="site-empty-buildIn-img site-empty-buildIn-simple"><div>

- Empty.PRESENTED_IMAGE_DEFAULT

  <div class="site-empty-buildIn-img site-empty-buildIn-default"></div>



## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
