# tour Token

Use these variables through `theme.components.Tour`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Tour: {
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
| `zIndexPopup` | `number` | Tour popup z-index |
| `closeBtnSize` | `number` | Close button size |
| `primaryPrevBtnBg` | `string` | Background color of previous button in primary type |
| `primaryNextBtnHoverBg` | `string` | Hover background color of next button in primary type |
