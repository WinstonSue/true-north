# tooltip Token

Use these variables through `theme.components.Tooltip`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Tooltip: {
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
| `maxWidth` | `number` | Max width of tooltip |
| `zIndexPopup` | `number` | z-index of tooltip |
