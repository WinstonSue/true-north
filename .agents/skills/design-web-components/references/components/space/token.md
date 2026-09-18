# space Token

Use these variables through `theme.components.Space`. This document lists definitions only and does not include values.

```vue
<sue-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
    components: {
      Space: {
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
| `addonPaddingInline` | `string \| number \| undefined` | Inline padding for Space.Addon cells.<br />yc-design 6.4.0 PR #56915. |
| `addonPaddingBlock` | `string \| number \| undefined` | Block padding for Space.Addon cells.<br />yc-design 6.4.0 PR #56915. |
