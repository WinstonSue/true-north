---
title: Carousel
description: A set of carousel areas.
---

## When To Use

- Use Carousel for a small set of related slides, banners, or media panels. See `demo/basic.md`.
- Use autoplay only when motion is helpful and not required for task completion. See `demo/autoplay.md`.
- Use arrows, fade, dot duration, or placement options for alternate navigation and motion styles. See `demo/arrows.md`, `demo/fade.md`, `demo/dot-duration.md`, and `demo/placement.md`.
- Prefer Tabs or Segmented when users need direct comparison between text-heavy panels.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Position | demo/placement.md |
| Scroll automatically | demo/autoplay.md |
| Fade in | demo/fade.md |
| Arrows for switching | demo/arrows.md |
| Progress of dots | demo/dot-duration.md |
| Component Token | demo/component-token.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| effect | Transition effect | CarouselEffect | `scrollx` | - |
| id | - | string | - | - |
| slickGoTo | - | number | - | - |
| dotPlacement | The position of the dots, which can be one of `top` `bottom` `start` `end` | DotPlacement | `bottom` | - |
| dots | Whether to show the dots at the bottom of the gallery, `object` for `dotsClass` | boolean \| &#123; class?: string &#125; | true | - |
| waitForAnimate | Whether to wait for the animation when switching | boolean | false | - |
| autoplay | Whether to scroll automatically, you can specify `autoplay=&#123;&#123; dotDuration: true &#125;&#125;` to display the progress bar | boolean \| &#123; dotDuration?: boolean &#125; | false | - |
| prevArrow | - | VueNode | - | - |
| nextArrow | - | VueNode | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| init | - | NonNullable&lt;Settings['onInit']&gt; | - |
| reInit | - | NonNullable&lt;Settings['onReInit']&gt; | - |
| edge | - | NonNullable&lt;Settings['onEdge']&gt; | - |
| swipe | - | NonNullable&lt;Settings['onSwipe']&gt; | - |
| lazyLoad | - | NonNullable&lt;Settings['onLazyLoad']&gt; | - |
| lazyLoadError | - | NonNullable&lt;Settings['onLazyLoadError']&gt; | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prevArrow | - | () =&gt; any | - |
| nextArrow | - | () =&gt; any | - |

### Methods

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| goTo | - | (slide: number, dontAnimate?: boolean) =&gt; void | - |
| next | - | () =&gt; void | - |
| prev | - | () =&gt; void | - |
| autoPlay | - | (playType?: 'update' \| 'leave' \| 'blur') =&gt; void | - |
| innerSlider | - | any | - |
