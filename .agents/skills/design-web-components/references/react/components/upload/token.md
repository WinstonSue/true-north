# upload Token

Use these variables through `theme.components.Upload`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Upload: {
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
| `actionsColor` | `string` | Action button color |
| `pictureCardSize` | `number` | Size of list items in card type (affects both picture-card and picture-circle) |
