# divider Token

Use these variables through `theme.components.Divider`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Divider: {
        // Token name: value
      },
    },
  }}
>
  ...
</ConfigProvider>
```

## Token List

| Token | Type | Description |
| --- | --- | --- |
| `textPaddingInline` | `CSSProperties` | Horizontal padding of text |
| `orientationMargin` | `number \| undefined` | Distance between text and edge, which should be a number between 0 and 1. |
| `verticalMarginInline` | `CSSProperties` | Horizontal margin of vertical Divider |
