# Basic

## Description (en-US)

Three sizes and two shapes are available.

## Source

```vue
<script setup lang="ts">
import { User } from '@lucide/vue'
</script>

<template>
  <sue-space direction="vertical" :size="16">
    <sue-space wrap :size="16">
      <sue-avatar :size="64">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar size="large">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar>
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar size="small">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar :size="14">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
    </sue-space>
    <sue-space wrap :size="16">
      <sue-avatar shape="square" :size="64">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar shape="square" size="large">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar shape="square">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar shape="square" size="small">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
      <sue-avatar shape="square" :size="14">
        <template #icon>
          <User />
        </template>
      </sue-avatar>
    </sue-space>
  </sue-space>
</template>
```
