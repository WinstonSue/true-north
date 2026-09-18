# context-menu Token

ContextMenu reuses Dropdown styles. Use these variables through `theme.components.Dropdown`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      ContextMenu: {
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
| `zIndexPopup` | `number` | z-index of dropdown |
| `paddingBlock` | `CSSProperties` | Vertical padding of dropdown |
