# transfer Token

Use these variables through `theme.components.Transfer`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Transfer: {
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
| `listWidth` | `string \| number` | Width of list |
| `listWidthLG` | `string \| number` | Width of large list |
| `listHeight` | `string \| number` | Height of list |
| `itemHeight` | `string \| number` | Height of list item |
| `itemPaddingBlock` | `string \| number` | Vertical padding of list item |
| `headerHeight` | `string \| number` | Height of header |
