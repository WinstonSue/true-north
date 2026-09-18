# rate Token

Use these variables through `theme.components.Rate`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Rate: {
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
| `starColor` | `string` | Star color |
| `starSize` | `number` | Star size |
| `starSizeSM` | `number` | Small star size |
| `starSizeLG` | `number` | Large star size |
| `starHoverScale` | `CSSObject` | Scale of star when hover |
| `starBg` | `string` | Star background color |
