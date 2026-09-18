# Custom spinning indicator

## Description (en-US)

Use custom loading indicator.

## Source

```vue
<script setup lang="ts">
import { Loader2 } from '@lucide/vue'
</script>

<template>
  <sue-flex align="center" gap="middle">
    <sue-spin size="small">
      <template #indicator>
        <Loader2 spin />
      </template>
    </sue-spin>
    <sue-spin>
      <template #indicator>
        <Loader2 spin />
      </template>
    </sue-spin>
    <sue-spin size="large">
      <template #indicator>
        <Loader2 spin />
      </template>
    </sue-spin>
    <sue-spin>
      <template #indicator>
        <Loader2 spin style="font-size: 48px" />
      </template>
    </sue-spin>
  </sue-flex>
</template>
```
