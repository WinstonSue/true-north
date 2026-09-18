# splitter Token

Use these variables through `theme.components.Splitter`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Splitter: {
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
| `splitBarDraggableSize` | `number` | Drag and drop the identity element size |
| `splitBarSize` | `number` | Drag the element display size |
| `splitTriggerSize` | `number` | Drag and drop trigger area size |
