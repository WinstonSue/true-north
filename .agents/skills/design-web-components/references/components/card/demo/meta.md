# Support more content configuration

## Description (en-US)

A Card that supports `cover`, `avatar`, `title` and `description`.

## Source

```vue
<script setup lang="ts">
import { Pencil, Ellipsis, Settings } from '@lucide/vue'
</script>

<template>
  <sue-card style="width: 300px">
    <template #cover>
      <img
        draggable="false"
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      >
    </template>
    <template #actions>
      <Settings key="setting" />
      <Pencil key="edit" />
      <Ellipsis key="ellipsis" />
    </template>
    <sue-card-meta title="Card title" description="This is the description">
      <template #avatar>
        <sue-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
      </template>
    </sue-card-meta>
  </sue-card>
</template>
```
