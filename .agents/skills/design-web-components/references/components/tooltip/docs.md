---
title: Tooltip
description: Simple text popup box.
---

## When To Use

- Use Tooltip for short, non-interactive hints attached to a target. See `demo/basic.md`.
- Use placement, arrow, color, disabled, shift, or smooth transition demos for display tuning. See `demo/placement.md`, `demo/arrow.md`, `demo/colorful.md`, `demo/disabled.md`, `demo/shift.md`, and `demo/smooth-transition.md`.
- Use wrap custom component guidance when the child component must forward events. See `demo/wrap-custom-component.md`.
- Prefer Popover for rich or interactive content.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Smooth Transition | demo/smooth-transition.md |
| Placement | demo/placement.md |
| Arrow | demo/arrow.md |
| Auto Shift | demo/shift.md |
| Colorful Tooltip | demo/colorful.md |
| Disabled | demo/disabled.md |
| Disabled children | demo/disabled-children.md |
| Wrap custom component | demo/wrap-custom-component.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Popup alignment config | AlignType | - | - |
| arrow | Show, hide or keep arrow in the center | boolean \| &#123; pointAtCenter?: boolean &#125; | - | - |
| autoAdjustOverflow | Auto adjust placement when tooltip is invisible | boolean \| AdjustOverflow | - | - |
| color | The background color. After using this attribute, the internal text color will adapt automatically | LiteralUnion&lt;PresetColorType&gt; | - | - |
| open | Whether tooltip is visible | boolean | - | - |
| defaultOpen | Initial open state | boolean | false | - |
| getPopupContainer | Specify container for tooltip | (triggerNode: HTMLElement) =&gt; HTMLElement | - | - |
| destroyOnHidden | Destroy tooltip when hidden | boolean | - | - |
| zIndex | Set z-index of tooltip | number | - | - |
| placement | Tooltip placement | TooltipPlacement | top | - |
| trigger | Trigger action | ActionType \| ActionType[] | - | - |
| fresh | Update content even when tooltip is hidden | boolean | - | - |
| mouseEnterDelay | Delay in seconds before showing tooltip | number | 0.1 | - |
| mouseLeaveDelay | Delay in seconds before hiding tooltip | number | 0.1 | - |
| classes | Semantic DOM class. Supports object or function | TooltipClassNamesType | - | - |
| styles | Semantic DOM style. Supports object or function | TooltipStylesType | - | - |
| getTooltipContainer | Legacy alias of `getPopupContainer` | (node: HTMLElement) =&gt; HTMLElement | - | - |
| motion | Popup motion config | VcTooltipProps['motion'] | - | - |
| afterOpenChange | Callback after visibility change | (open: boolean) =&gt; void | - | - |
| builtinPlacements | Built-in placement config | typeof Placements | - | - |
| title | The text shown in the tooltip | VueNode | - | - |
| overlay | Legacy alias of `title` | VueNode | - | - |
| openClass | Class added to child when tooltip is open | string | - | - |
| unique | Enable unique display inside `SueUniqueProvider`/ConfigProvider | boolean | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Callback when tooltip visibility changes | (open: boolean) =&gt; void | - |
| update:open | Emit when tooltip visibility changes | (open: boolean) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| title | The text shown in the tooltip |  =&gt; any | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| forceAlign | Force popup realign | VoidFunction | - |
| nativeElement | Wrapped dom element. Not promise valid if child not support ref | HTMLElement | - |
| popupElement | Popup dom element | HTMLDivElement | - |

### ConfigProvider - tooltip.unique
Configure global unique Tooltip display through ConfigProvider `tooltip.unique`. When enabled, only one Tooltip under that provider is displayed at a time. See ConfigProvider docs and Tooltip demos for concrete usage.

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why doesn't HOC work sometimes? 
Please ensure that the child elements of `Tooltip` can accept `mouseenter`, `mouseleave`, `pointerenter`, `pointerleave`, `focus`, `click` events.


### Why Tooltip not update content when close? 
Tooltip caches closed content to avoid flicker. Set `fresh` when closed tooltip content must update immediately.
