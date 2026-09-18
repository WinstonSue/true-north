# card Token

Use these variables through `theme.components.Card`. This document lists definitions only and does not include values.

```tsx
import { ConfigProvider } from '@sue/design-web-react';

<ConfigProvider
  theme={{
    token: {
      // Global token configuration
    },
    components: {
      Card: {
        // Token name: value
      },
    },
  }}
>
  ...
</ConfigProvider>
```

## Token List

The default size spacing uses global tokens: `small` uses `paddingXS` and `paddingSM`, `medium` uses `paddingSM` and `padding`, and `large` uses `padding` and `paddingLG`.

| Token | Type | Description |
| --- | --- | --- |
| `headerBg` | `string` | Background color of card header |
| `headerFontSize` | `string \| number` | Font size of card header |
| `headerFontSizeSM` | `string \| number` | Font size of small card header |
| `headerHeight` | `string \| number` | Min height of medium/default card header |
| `headerHeightSM` | `string \| number` | Height of small card header |
| `headerHeightLG` | `string \| number` | Height of large card header |
| `bodyPaddingSM` | `string \| number` | Full padding shorthand of small card body |
| `headerPaddingSM` | `number` | Padding of small card head |
| `bodyPadding` | `string \| number` | Full padding shorthand of medium/default card body |
| `headerPadding` | `number` | Padding of card head |
| `bodyPaddingLG` | `string \| number` | Full padding shorthand of large card body |
| `headerPaddingLG` | `number` | Padding of large card head |
| `actionsBg` | `string` | Background color of card actions |
| `actionsLiMargin` | `string` | Margin of each item in card actions |
| `tabsMarginBottom` | `number` | Margin bottom of tabs component |
| `extraColor` | `string` | Text color of extra area |
