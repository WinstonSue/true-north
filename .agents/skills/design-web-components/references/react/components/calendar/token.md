# calendar Token

Use these variables through `theme.components.Calendar`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Calendar: {
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
| `yearControlWidth` | `string \| number` | Width of year select |
| `monthControlWidth` | `string \| number` | Width of month select |
| `miniContentHeight` | `string \| number` | Height of mini calendar content |
| `fullBg` | `string` | Background color of full calendar |
| `fullPanelBg` | `string` | Background color of full calendar panel |
| `itemActiveBg` | `string` | Background color of selected date item |
