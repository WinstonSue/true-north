# Basic

## Description (en-US)

Simplest Usage. Badge will be hidden when `count` is `0`, but we can use `showZero` to show it.

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
</script>

<template>
  <sue-space size="medium">
    <sue-badge :count="5">
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge :count="0" show-zero>
      <sue-avatar shape="square" size="large" />
    </sue-badge>
    <sue-badge>
      <template #count>
        <Clock style="color: #f5222d" />
      </template>
      <sue-avatar shape="square" size="large" />
    </sue-badge>
  </sue-space>
</template>
```
