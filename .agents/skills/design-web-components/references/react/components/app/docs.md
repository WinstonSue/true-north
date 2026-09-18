---
title: "App"
description: "Application wrapper for some global usages."
---

## When To Use

- Provide reset styles based on `.ant-app` element.
- You could use static methods of `message/notification/Modal` from `useApp` without writing `contextHolder` manually.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Hooks config | demo/config.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

> This component is available since `antd@5.1.0`.

### App

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| component | Config render element, if `false` will not create DOM node | ComponentType \| false | div | 5.11.0 | × |
| message | Global config for Message | [MessageConfig](/components/message/#messageconfig) | - | 5.3.0 | × |
| notification | Global config for Notification | [NotificationConfig](/components/notification/#notificationconfig) | - | 5.3.0 | × |

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### CSS Var doesn't work inside `<App component={false}>` {#faq-css-var-component-false}

Make sure the App `component` is a valid html tag, so when you're turning on CSS variables, there's a container to hold the CSS class name. If not set, it defaults to the `div` tag. If set to `false`, no additional DOM nodes will be created, and no default styles will be provided.
