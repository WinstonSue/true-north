---
title: "Carousel"
description: "A set of carousel areas."
---

## When To Use

- When there is a group of content on the same level.
- When there is insufficient content space, it can be used to save space in the form of a revolving door.
- Commonly used for a group of pictures/cards.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Position | demo/placement.md |
| Scroll automatically | demo/autoplay.md |
| Fade in | demo/fade.md |
| Arrows for switching | demo/arrows.md |
| Progress of dots | demo/dot-duration.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| arrows | Whether to show switch arrows | boolean | false | 5.17.0 | × |
| autoplay | Whether to scroll automatically, you can specify `autoplay={{ dotDuration: true }}` to display the progress bar | boolean \| { dotDuration?: boolean } | false | dotDuration: 5.24.0 | × |
| autoplaySpeed | Delay between each auto scroll (in milliseconds) | number | 3000 |  | × |
| adaptiveHeight | Adjust the slide's height automatically | boolean | false |  | × |
| dotPlacement | The position of the dots, which can be one of `top` `bottom` `start` `end` | string | `bottom` |  | × |
| dots | Whether to show the dots at the bottom of the gallery, `object` for `dotsClass` | boolean \| { className?: string } | true |  | × |
| draggable | Enable scrollable via dragging on desktop | boolean | false |  | × |
| fade | Whether to use fade transition | boolean | false |  | × |
| infinite | Infinitely wrap around contents | boolean | true |  | × |
| speed | Animation speed in milliseconds | number | 500 |  | × |
| easing | Transition interpolation function name | string | `linear` |  | × |
| effect | Transition effect | `scrollx` \| `fade` | `scrollx` |  | × |
| afterChange | Callback function called after the current index changes | (current: number) => void | - |  | × |
| beforeChange | Callback function called before the current index changes | (current: number, next: number) => void | - |  | × |
| waitForAnimate | Whether to wait for the animation when switching | boolean | false |  | × |

Find more APIs in react-slick [documentation](https://react-slick.neostack.com/docs/api).

## Methods

| Name | Description |
| --- | --- |
| goTo(slideNumber, dontAnimate) | Go to slide index, if dontAnimate=true, it happens without animation |
| next() | Change current slide to next slide |
| prev() | Change current slide to previous slide |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### How to add custom arrows? {#faq-add-custom-arrows}

See [#12479](https://github.com/yuce-design/yuce-design/issues/12479).
