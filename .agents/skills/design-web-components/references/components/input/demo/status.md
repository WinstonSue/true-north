# Status

## Description (en-US)

Add status to Input with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
</script>

<template>
  <sue-space direction="vertical" style="width: 100%;">
    <sue-input status="error" placeholder="Error" />
    <sue-input status="warning" placeholder="Warning" />
    <sue-input status="error" placeholder="Error with prefix">
      <template #prefix>
        <Clock />
      </template>
    </sue-input>
    <sue-input status="warning" placeholder="Warning with prefix">
      <template #prefix>
        <Clock />
      </template>
    </sue-input>
  </sue-space>
</template>
```
