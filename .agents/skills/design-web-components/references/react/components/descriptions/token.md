# descriptions Token

Use these variables through `theme.components.Descriptions`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Descriptions: {
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
| `labelBg` | `string` | Background color of label |
| `labelColor` | `string` | Text color of label |
| `titleColor` | `string` | Text color of title |
| `titleMarginBottom` | `number` | Bottom margin of title |
| `itemPaddingBottom` | `number` | Bottom padding of item |
| `itemPaddingEnd` | `number` | End padding of item |
| `colonMarginRight` | `number` | Right margin of colon |
| `colonMarginLeft` | `number` | Left margin of colon |
| `contentColor` | `string` | Text color of content |
| `extraColor` | `string` | Text color of extra area |
