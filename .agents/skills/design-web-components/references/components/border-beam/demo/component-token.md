# Line width

## Description (en-US)

Override the BorderBeam `lineWidth` token via `ConfigProvider` theme.components to adjust the beam thickness.

## Source

```vue
<script setup lang="ts">
const customTheme = {
  components: {
    BorderBeam: { lineWidth: 3 },
  },
}
</script>

<template>
  <sue-flex :gap="24" wrap>
    <div :style="{ width: '320px' }">
      <sue-border-beam>
        <sue-card title="Default line width">
          <sue-editable-text type="secondary">
            Uses the default global lineWidth token from the current theme.
          </sue-editable-text>
        </sue-card>
      </sue-border-beam>
    </div>
    <sue-config-provider :theme="customTheme">
      <div :style="{ width: '320px' }">
        <sue-border-beam>
          <sue-card title="Custom line width">
            <sue-editable-text type="secondary">
              Override lineWidth from theme.token.
            </sue-editable-text>
          </sue-card>
        </sue-border-beam>
      </div>
    </sue-config-provider>
  </sue-flex>
</template>
```
