# Advanced Usage

## Description (en-US)

With Popover.

## Source

```vue
<script setup lang="ts">
defineOptions({ name: 'Popover' })
</script>

<template>
  <sue-popover>
    <template #content>
      <sue-qrcode value="https://ant.design" :bordered="false" />
    </template>
    <sue-button type="primary">
      Hover me
    </sue-button>
  </sue-popover>
</template>
```
