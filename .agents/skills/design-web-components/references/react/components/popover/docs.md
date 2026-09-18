---
title: "Popover"
description: "The floating card pops up when clicking/mouse hovering over an element."
---

## When To Use

A simple popup menu to provide extra information or operations.

Comparing with `Tooltip`, besides information `Popover` card can also provide action elements like links and buttons.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Placement | demo/placement.md |
| Arrow | demo/arrow.md |
| Auto Shift | demo/shift.md |
| Controlling the close of the dialog | demo/control.md |
| Hover with click popover | demo/hover-with-click.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default value | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), string> | - |  | 5.23.0 |
| content | Content of the card | ReactNode \| () => ReactNode | - |  | × |
| title | Title of the card | ReactNode \| () => ReactNode | - |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props })=> Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 5.23.0 |

<!-- Common API -->

<embed src="../tooltip/shared/sharedProps.en-US.md"></embed>

## Note

Please ensure that the child node of `Popover` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

<embed src="../tooltip/shared/sharedFAQ.en-US.md"></embed>

For more questions, please refer to [Tooltip FAQ](../tooltip/docs.md#faq).
