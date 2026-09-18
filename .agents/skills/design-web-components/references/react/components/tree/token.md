# tree Token

Use these variables through `theme.components.Tree`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Tree: {
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
| `directoryNodeSelectedColor` | `string` | Text color of selected directory node |
| `directoryNodeSelectedBg` | `string` | Background color of selected directory node |
| `titleHeight` | `number` | Node title height |
| `switcherSize` | `number \| undefined` | Switcher width of tree |
| `indentSize` | `number \| undefined` | Indent width of tree |
| `nodeHoverBg` | `string` | Background color of hovered node |
| `nodeHoverColor` | `string` | Text color of hovered node |
| `nodeSelectedBg` | `string` | Background color of selected node |
| `nodeSelectedColor` | `string` | Text color of selected node |
