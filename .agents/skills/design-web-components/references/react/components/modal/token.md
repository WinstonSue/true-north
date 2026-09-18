# modal Token

Use these variables through `theme.components.Modal`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Modal: {
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
| `headerBg` | `string` | Background color of header |
| `titleLineHeight` | `string \| number` | Line height of title |
| `titleFontSize` | `string \| number` | Font size of title |
| `titleColor` | `string` | Font color of title |
| `contentBg` | `string` | Background color of content |
