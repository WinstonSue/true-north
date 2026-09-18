# timeline Token

Use these variables through `theme.components.Timeline`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Timeline: {
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
| `tailColor` | `string \| undefined` | Line color |
| `tailWidth` | `string \| number \| undefined` | Line width |
| `dotBorderWidth` | `string \| number \| undefined` | Border width of node |
| `dotSize` | `string \| number \| undefined` | Node size |
| `dotBg` | `string \| undefined` | Background color of node |
| `itemPaddingBottom` | `number \| undefined` | Bottom padding of item |
