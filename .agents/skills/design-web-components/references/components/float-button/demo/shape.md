# Shape

## Description (en-US)

Change the shape of the FloatButton with the `shape` property.

## Source

```vue
<script setup lang="ts">
import { Headset } from '@lucide/vue'
</script>

<template>
  <sue-float-button shape="circle" type="primary" style="inset-inline-end: 94px">
    <template #icon>
      <Headset />
    </template>
  </sue-float-button>
  <sue-float-button shape="square" type="primary" style="inset-inline-end: 24px">
    <template #icon>
      <Headset />
    </template>
  </sue-float-button>
</template>
```
