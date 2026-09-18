# Status

## Description (en-US)

Add status to Transfer with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
const emptyData: any[] = []
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-transfer :data-source="emptyData" status="error" />
    <sue-transfer :data-source="emptyData" status="warning" show-search />
  </sue-flex>
</template>
```
