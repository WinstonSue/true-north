# spin Token

Use these variables through `theme.components.Spin`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Spin: {
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
| `contentHeight` | `string \| number` | Height of content area |
| `dotSize` | `number` | Loading icon size |
| `dotSizeSM` | `number` | Small loading icon size |
| `dotSizeLG` | `number` | Large loading icon size |
