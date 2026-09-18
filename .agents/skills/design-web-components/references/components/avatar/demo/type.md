# Type

## Description (en-US)

Image, Icon and letter are supported, and the latter two kinds of avatar can have custom colors and background colors.

## Source

```vue
<script setup lang="ts">
import { User } from '@lucide/vue'

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
</script>

<template>
  <sue-space :size="16" wrap>
    <sue-avatar>
      <template #icon>
        <User />
      </template>
    </sue-avatar>
    <sue-avatar>U</sue-avatar>
    <sue-avatar :size="40">
      USER
    </sue-avatar>
    <sue-avatar :src="url" />
    <sue-avatar>
      <template #src>
        <img :src="url" alt="avatar" :draggable="false">
      </template>
    </sue-avatar>
    <sue-avatar style="background-color: #fde3cf; color: #f56a00;">
      U
    </sue-avatar>
    <sue-avatar style="background-color: #87d068;">
      <template #icon>
        <User />
      </template>
    </sue-avatar>
  </sue-space>
</template>
```
