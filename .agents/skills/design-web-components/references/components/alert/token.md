# alert Token

Use these variables through `theme.components.Alert`. This document lists definitions only and does not include values.

```vue
<sue-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Alert: {
        // Token name: value
      },
    },
  }"
>
  ...
</sue-config-provider>
```

## Token List

| Token | Type | Description |
| --- | --- | --- |
| `defaultPadding` | `CSSProperties` | Default padding |
| `withDescriptionPadding` | `CSSProperties` | Padding with description |
| `withDescriptionIconSize` | `string \| number` | Icon size with description |
