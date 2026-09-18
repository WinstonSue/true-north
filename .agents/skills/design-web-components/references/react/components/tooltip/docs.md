---
title: "Tooltip"
description: "Simple text popup box."
---

## When To Use

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.
- To provide an explanation of a `button/text/operation`. It's often used instead of the html `title` attribute.

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
| Wrap custom component | demo/wrap-custom-component.md |
| Custom semantic dom styling | demo/style-class.md |
|  semantic | demo/_semantic.md |

## API

Common props ref：[Common props](../../docs/react/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| title | The text shown in the tooltip | ReactNode \| () => ReactNode | - | - | × |
| color | The background color. After using this attribute, the internal text color will adapt automatically | string | - | 5.27.0 | × |
| classNames | Semantic DOM class | Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string> | - | 5.23.0 | 5.23.0 |
| styles | Semantic DOM style | Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties> | - | 5.23.0 | 5.23.0 |

### Common API

<embed src="./shared/sharedProps.en-US.md"></embed>

### ConfigProvider - tooltip.unique {#config-provider-tooltip-unique}

You can configure global unique display for Tooltip through ConfigProvider. When `unique` is set to `true`, only one Tooltip under the ConfigProvider will be displayed at the same time, providing better user experience and smooth transition effects.

Note: After configuration, properties like `getContainer`, `arrow` etc. will be ignored.

```tsx
import { Button, ConfigProvider, Space, Tooltip } from '@sue/design-web-react';

export default () => (
  <ConfigProvider
    tooltip={{
      unique: true,
    }}
  >
    <Space>
      <Tooltip title="First tooltip">
        <Button>Button 1</Button>
      </Tooltip>
      <Tooltip title="Second tooltip">
        <Button>Button 2</Button>
      </Tooltip>
    </Space>
  </ConfigProvider>
);
```

## Semantic DOM

See `demo/_semantic.md`.

## Design Token

See `token.md` for component token definitions.</ComponentTokenTable>

## FAQ

### Why doesn't HOC work sometimes? {#faq-hoc-component}

Please ensure that the child elements of `Tooltip` can accept `onMouseEnter`, `onMouseLeave`, `onPointerEnter`, `onPointerLeave`, `onFocus`, `onClick` events.

Please refer to https://github.com/yuce-design/yuce-design/issues/15909

### Why Tooltip not update content when close? {#faq-content-not-update}

Tooltip will cache content when it is closed to avoid flicker when content is updated:

```jsx
// `title` will not blink when `user` is empty
<Tooltip open={user} title={user?.name} />
```

<div>
<img alt="no blink" height="50" src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KVx7QLOYwVsAAAAAAAAAAAAADrJ8AQ/original" />
</div>

If need update content when close, you can set `fresh` property ([#44830](https://github.com/yuce-design/yuce-design/issues/44830)):

```jsx
<Tooltip open={user} title={user?.name} fresh />
```

<div>
<img alt="no blink" height="50" src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rUbsR4xWpMsAAAAAAAAAAAAADrJ8AQ/original" />
</div>

---

<!-- Make sure this remains at the end of FAQ -->

<embed src="./shared/sharedFAQ.en-US.md"></embed>
