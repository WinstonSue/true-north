---
title: Timeline
description: Vertical display timeline.
---

## When To Use

- Use Timeline for chronological events, audit trails, histories, or progress narratives. See `demo/basic.md`.
- Use alternate, pending, custom, variant, horizontal, or title demos for different event presentations. See `demo/alternate.md`, `demo/pending.md`, `demo/custom.md`, `demo/variant.md`, `demo/horizontal.md`, and `demo/title.md`.
- For a known process with current progress, use the `step` scenario in `@sue/design-web-scenarios`.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Alternate | demo/alternate.md |
| Custom | demo/custom.md |
| SFC Mode | demo/sfc.md |
| Pending | demo/pending.md |
| Label | demo/title.md |
| Variant | demo/variant.md |
| Right Alternate | demo/end.md |
| Horizontal | demo/horizontal.md |
| Title Offset | demo/title-span.md |
| Semantic Sample | demo/semantic.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, string&gt; | - | - |
| items | Each node of timeline | TimelineItemProps[] | - | - |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right | `left` \| `alternate` \| `right` | - | - |
| reverse | Whether reverse nodes or not | boolean | false | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record&lt;SemanticDOM, CSSProperties&gt; | - | - |
| dotRender | Custom rendering function for timeline dot | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| labelRender | Custom rendering function for timeline label | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |
| contentRender | Custom rendering function for timeline content | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| dotRender | Custom rendering function for timeline dot | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| labelRender | Custom rendering function for timeline label | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |
| contentRender | Custom rendering function for timeline content | (params: &#123; item: TimelineItemProps, index: number &#125;) =&gt; VueNode | - |

## Types

### TimelineItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green`, `gray` or other custom colors | string | `blue` | - |
| dot | Customize timeline dot | VueNode | - | - |
| key | Unique key for this item | Key | - | - |
| label | Set the label | VueNode | - | - |
| loading | Set loading state | boolean | false | - |
| pending | Whether this item is pending | boolean | false | - |
| position | Customize node position | `left` \| `right` | - | - |

## Semantic DOM 
| _semantic | demo/_semantic.md |
