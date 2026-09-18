---
title: "Collapse"
description: "A content area which can be collapsed and expanded."
---

## When To Use

- Can be used to group or hide complex regions to keep the page clean.
- `Accordion` is a special kind of `Collapse`, which allows only one panel to be expanded at a time.

## Demos

| Demo | Path |
| --- | --- |
| Collapse | demo/basic.md |
| Size | demo/size.md |
| Accordion | demo/accordion.md |
| Nested panel | demo/mix.md |
| Borderless | demo/borderless.md |
| Custom Panel | demo/custom.md |
| No arrow | demo/noarrow.md |
| Extra node | demo/extra.md |
| Ghost Collapse | demo/ghost.md |
| Collapsible | demo/collapsible.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

### Collapse

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| accordion | If true, Collapse renders as Accordion | boolean | false |  | × |
| activeKey | Key of the active panel | string\[] \| string <br/> number\[] \| number | No default value. In [accordion mode](#collapse-demo-accordion), it's the key of the first panel |  | × |
| bordered | Toggles rendering of the border around the collapse block | boolean | true |  | × |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| collapsible | Specify how to trigger Collapse. Either by clicking icon or by clicking any area in header or disable collapse functionality itself | `header` \| `icon` \| `disabled` | - | 4.9.0 | × |
| defaultActiveKey | Key of the initial active panel | string\[] \| string <br/> number\[] \| number | - |  | × |
| destroyOnHidden | Destroy Inactive Panel | boolean | false | 5.25.0 | × |
| expandIcon | Customize the collapse expand icon | (panelProps) => ReactNode | - |  | 5.15.0 |
| expandIconPlacement | Set expand icon placement | `start` \| `end` | `start` | - | × |
| ghost | Make the collapse borderless and its background transparent | boolean | false | 4.4.0 | × |
| size | Set the size of collapse | `large` \| `medium` \| `small` | `medium` | 5.2.0 | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| onChange | Callback function executed when active panel is changed | function | - |  | × |
| items | collapse items content | [ItemType](#itemtype) | - | 5.6.0 | × |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic structure className | [`Record<header \| body, string>`](#semantic-dom) | - | 5.21.0 |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - |  |
| children | Body area content | ReactNode | - |  |
| extra | The extra element in the corner | ReactNode | - |  |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false |  |
| key | Unique key identifying the panel from among its siblings | string \| number | - |  |
| label | Title of the panel | ReactNode | - | - |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true |  |
| styles | Semantic DOM style | [`Record<header \| body, CSSProperties>`](#semantic-dom) | - | 5.21.0 |

### Collapse.Panel

:::warning{title=Deprecated}
When using version >= 5.6.0, we prefer to configuring the panel by `items`.
:::

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Specify whether the panel be collapsible or the trigger area of collapsible | `header` \| `icon` \| `disabled` | - | 4.9.0 (icon: 4.24.0) |
| extra | The extra element in the corner | ReactNode | - |  |
| forceRender | Forced render of content on panel, instead of lazy rendering after clicking on header | boolean | false |  |
| header | Title of the panel | ReactNode | - |  |
| key | Unique key identifying the panel from among its siblings | string \| number | - |  |
| showArrow | If false, panel will not show arrow icon. If false, collapsible can't be set as icon | boolean | true |  |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
