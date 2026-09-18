# Vertical Direction

## Description (en-US)

Make it vertical.

## Source

```vue
<script setup lang="ts">
import { LayoutGrid, Menu } from '@lucide/vue'

const iconObj: Record<string, any> = {
  List: Menu,
  Kanban: LayoutGrid,
}
</script>

<template>
  <sue-segmented
    orientation="vertical"
    :options="[
      { value: 'List' },
      { value: 'Kanban' },
    ]"
  >
    <template #iconRender="{ value }">
      <component :is="iconObj[value]" v-if="iconObj[value]" />
    </template>
  </sue-segmented>
</template>
```
