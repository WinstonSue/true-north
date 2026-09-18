# Status

## Description (en-US)

Add status to InputNumber with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
</script>

<template>
  <sue-space direction="vertical" style="width: 100%;">
    <sue-input-number status="error" style="width: 100%;" />
    <sue-input-number status="warning" style="width: 100%;" />
    <sue-input-number status="error" style="width: 100%;">
      <template #prefix>
        <Clock />
      </template>
    </sue-input-number>
    <sue-input-number status="warning" style="width: 100%;">
      <template #prefix>
        <Clock />
      </template>
    </sue-input-number>
  </sue-space>
</template>
```
