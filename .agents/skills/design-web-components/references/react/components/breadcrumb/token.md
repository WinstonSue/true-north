# breadcrumb Token

Use these variables through `theme.components.Breadcrumb`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Breadcrumb: {
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
| `itemColor` | `string` | Text color of Breadcrumb item |
| `iconFontSize` | `number` | Icon size |
| `linkColor` | `string` | Text color of link |
| `linkHoverColor` | `string` | Color of hovered link |
| `lastItemColor` | `string` | Text color of the last item |
| `separatorMargin` | `number` | Margin of separator |
| `separatorColor` | `string` | Color of separator |
