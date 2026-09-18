# dropdown Token

Use these variables through `theme.components.Dropdown`. This document lists definitions only and does not include values.

```vue
<sue-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Dropdown: {
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
| `zIndexPopup` | `number` | z-index of dropdown |
| `paddingBlock` | `CSSProperties` | Vertical padding of dropdown |
