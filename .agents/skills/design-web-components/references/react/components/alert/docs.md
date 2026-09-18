---
title: "Alert"
description: "Display warning messages that require attention."
---

## When To Use

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| More types | demo/style.md |
| Closable | demo/closable.md |
| Description | demo/description.md |
| Icon | demo/icon.md |
| Banner | demo/banner.md |
| Loop Banner | demo/loop-banner.md |
| Smoothly Unmount | demo/smooth-closed.md |
| Custom action | demo/action.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| action | The action of Alert | ReactNode | - |  | × |
| banner | Whether to show as banner | boolean | false |  | × |
| variant | Variant of Alert style | `outlined` \| `filled` | `outlined` | 6.4.0 | 6.4.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - |  | 6.0.0 |
| closable | The config of closable | boolean \| [ClosableType](#closabletype) & React.AriaAttributes | `false` |  | 5.15.0 |
| closeIcon | (Only supports global configuration) Custom close icon | ReactNode | - | × | 5.14.0 |
| description | Additional content of Alert | ReactNode | - |  | × |
| errorIcon | (Only supports global configuration) Custom error icon in Alert icon | ReactNode | - | × | 6.2.0 |
| icon | Custom icon, effective when `showIcon` is true | ReactNode | - |  | × |
| infoIcon | (Only supports global configuration) Custom info icon in Alert icon | ReactNode | - | × | 6.2.0 |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true |  | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - |  | 6.0.0 |
| successIcon | (Only supports global configuration) Custom success icon in Alert icon | ReactNode | - | × | 6.2.0 |
| title | Content of Alert | ReactNode | - |  | × |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | string | `info`, in `banner` mode default is `warning` |  | × |
| warningIcon | (Only supports global configuration) Custom warning icon in Alert icon | ReactNode | - | × | 6.2.0 |

### ClosableType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| afterClose | Called when close animation is finished | function | - | - |
| closeIcon | Custom close icon | ReactNode | - | - |
| onClose | Callback when Alert is closed | (e: MouseEvent) => void | - | - |

### Alert.ErrorBoundary

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| description | Custom error description to show | ReactNode | {{ error stack }} |  |
| title | Custom error title to show | ReactNode | {{ error }} |  |

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>
