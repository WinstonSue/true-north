# tag Token

Use these variables through `theme.components.Tag`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Tag: {
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
| `defaultBg` | `string` | Default background color |
| `defaultColor` | `string` | Default text color |
| `solidTextColor` | `string` | Default text color for solid tag. |
