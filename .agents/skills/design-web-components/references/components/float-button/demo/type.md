# Type

## Description (en-US)

Change the type of the FloatButton with the `type` property.

## Source

```vue
<script setup lang="ts">
import { CircleHelp } from '@lucide/vue'
</script>

<template>
  <sue-float-button type="primary" style="inset-inline-end: 24px;">
    <template #icon>
      <CircleHelp />
    </template>
  </sue-float-button>
  <sue-float-button type="default" style="inset-inline-end: 94px;">
    <template #icon>
      <CircleHelp />
    </template>
  </sue-float-button>
</template>
```
