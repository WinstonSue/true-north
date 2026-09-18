---
title: App
description: Application wrapper for some global usages.
---

## When To Use

- Wrap the application with App when Message, Notification, or Modal APIs need access to context without manually rendering holders. See `demo/basic.md`.
- Use App together with ConfigProvider when static feedback APIs must inherit theme, locale, prefix, or other provider context. See `demo/config.md`.
- Avoid nested App wrappers unless a subtree intentionally needs isolated feedback configuration.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Hooks config | demo/config.md |

## Notes

App uses provide/inject, so `App.useApp` must be called under an App provider. Place App near the application root, usually inside ConfigProvider when theme or locale context matters. See `demo/basic.md` and `demo/config.md`.

## API

### Property 
Common props ref：[Common props](../../docs/vue/common-props.md)

| Property     | Description                                               | Type               | Default | Version |
| ------------ | --------------------------------------------------------- | ------------------ | ------- | ------- |
| message      | Global config for Message                                 | MessageConfig      | -       |         |
| notification | Global config for Notification                            | NotificationConfig | -       |         |
| component    | Config render element, if`false` will not create DOM node | any                | div     |         |

## FAQ

### CSS Var doesn't work inside `<sue-app :component="false">` 
Make sure the App `component` is a valid html tag, so when you're turning on CSS variables, there's a container to hold the CSS class name. If not set, it defaults to the `div` tag. If set to `false`, no additional DOM nodes will be created, and no default styles will be provided.
