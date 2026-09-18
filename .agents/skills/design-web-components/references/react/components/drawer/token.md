# drawer Token

Use these variables through `theme.components.Drawer`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Drawer: {
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
| `zIndexPopup` | `number` | z-index of drawer |
| `draggerSize` | `number` | Size of resize handle |
