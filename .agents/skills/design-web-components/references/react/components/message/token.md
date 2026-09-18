# message Token

Use these variables through `theme.components.Message`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Message: {
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
| `zIndexPopup` | `number` | z-index of Message |
| `contentBg` | `string` | Background color of Message |
| `contentPadding` | `CSSProperties` | Padding of Message |
