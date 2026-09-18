# carousel Token

Use these variables through `theme.components.Carousel`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Carousel: {
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
| `dotWidth` | `string \| number` | Width of indicator |
| `dotHeight` | `string \| number` | Height of indicator |
| `dotGap` | `number` | gap between indicator |
| `dotOffset` | `number` | dot offset to Carousel edge |
| `dotActiveWidth` | `string \| number` | Width of active indicator |
| `arrowSize` | `number` | Size of arrows |
| `arrowOffset` | `number` | arrows offset to Carousel edge |
