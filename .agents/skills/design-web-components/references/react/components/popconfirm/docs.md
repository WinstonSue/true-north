---
title: "Popconfirm"
description: "Pop up a bubble confirmation box for an action."
---

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Locale text | demo/locale.md |
| Placement | demo/placement.md |
| Auto Shift | demo/shift.md |
| Conditional trigger | demo/dynamic-trigger.md |
| Customize icon | demo/icon.md |
| Asynchronously close | demo/async.md |
| Asynchronously close on Promise | demo/promise.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#api) | - |  | × |
| cancelText | The text of the Cancel button | string | `Cancel` |  | × |
| disabled | Whether show popconfirm when click its childrenNode | boolean | false |  | × |
| icon | Customize icon of confirmation | ReactNode | &lt;CircleAlert /> |  | × |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#api) | - |  | × |
| okText | The text of the Confirm button | string | `OK` |  | × |
| okType | Button `type` of the Confirm button | string | `primary` |  | × |
| showCancel | Show cancel button | boolean | true | 4.18.0 | × |
| title | The title of the confirmation box | ReactNode \| () => ReactNode | - |  | × |
| description | The description of the confirmation box title | ReactNode \| () => ReactNode | - | 5.1.0 | × |
| onCancel | A callback of cancel | function(e) | - |  | × |
| onConfirm | A callback of confirmation | function(e) | - |  | × |
| onPopupClick | A callback of popup click | function(e) | - | 5.5.0 | × |

<!-- Common API -->

<embed src="../tooltip/shared/sharedProps.en-US.md"></embed>

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

<embed src="../tooltip/shared/sharedFAQ.en-US.md"></embed>

For more questions, please refer to [Tooltip FAQ](../tooltip/docs.md#faq).
