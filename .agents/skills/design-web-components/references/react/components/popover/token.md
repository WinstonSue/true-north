# popover Token

Use these variables through `theme.components.Popover`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Popover: {
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
| `titleMinWidth` | `string \| number` | Min width of Popover title |
| `zIndexPopup` | `number` | z-index of Popover |
