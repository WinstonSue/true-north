---
title: Card
description: A container for displaying information.
---

## When To Use

- Use Card to group related content and actions as one scannable unit. See `demo/basic.md` and `demo/simple.md`.
- Use `loading`, inner cards, grid cards, or tabs when the card owns local state or substructure. See `demo/loading.md`, `demo/inner.md`, `demo/grid-card.md`, and `demo/tabs.md`.
- Use Meta or custom content when presenting media, entity summaries, or content previews. See `demo/meta.md` and `demo/flexible-content.md`.
- Avoid nesting decorative page sections as cards; reserve Card for actual grouped items or tools.

## Demos

| Demo | Path |
| --- | --- |
| Basic card片 | demo/basic.md |
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
| Cover and actions without body | demo/no-body-debug.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Card

When `size` is omitted, Card uses `medium` spacing.

| Size | Body padding | Header padding | Header min height |
| --- | --- | --- | --- |
| `small` | `8px 12px` | `0 12px` | `38px` |
| `medium` (default) | `12px 16px` | `0 16px` | `48px` |
| `large` | `16px 24px` | `0 24px` | `56px` |

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Card title | VueNode | - | - |
| extra | Content to render in the top-right corner of the card | VueNode | - | - |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | false | - |
| hoverable | Lift up when hovering card | boolean | false | - |
| id | - | string | - | - |
| size | Size of card | `small` \| `medium` \| `large` | `medium` | - |
| type | Card style type, can be set to `inner` or not set | CardType | - | - |
| cover | Card cover | VueNode | - | - |
| actions | The action list, shows at the bottom of the Card | VueNode[] | - | - |
| tabList | List of TabPane's head | CardTabListType[] | - | - |
| tabBarExtraContent | Extra content in tab bar | VueNode \| &#123; [key: string]: VueNode &#125; | - | - |
| activeTabKey | Current TabPane's key | string | - | - |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set | string | `The key of first tab` | - |
| tabProps | [Tabs](../tabs/docs.md/#tabs) | Record&lt;string, any&gt; | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CardClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CardStylesType | - | - |
| variant | Variants of Card | 'borderless' \| 'outlined' | `outlined` | - |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| tabChange | Callback when tab is switched | (key: string) =&gt; void | - |
| update:activeTabKey | - | (key: string) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | Card title | () =&gt; any | - |
| extra | Content to render in the top-right corner of the card | () =&gt; any | - |
| cover | Card cover | () =&gt; any | - |
| actions | The action list, shows at the bottom of the Card | () =&gt; any | - |
| tabContentRender | - | TabsSlots['contentRender'] | - |
| tabLabelRender | - | TabsSlots['labelRender'] | - |
| tabBarExtraContent | Extra content in tab bar | () =&gt; any | - |

### CardGrid

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| hoverable | Lift up when hovering card | boolean | false | - |

### CardMeta

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - |
| avatar | - | VueNode | - | - |
| title | Card title | VueNode | - | - |
| description | - | VueNode | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CardMetaClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CardMetaStylesType | - | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| avatar | Avatar | () =&gt; any | - |
| title | Title | () =&gt; any | - |
| description | Description | () =&gt; any | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
