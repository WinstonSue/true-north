# With Icon

## Description (en-US)

Set icon for Segmented Item.

## Source

```vue
<script setup lang="ts">
import { LayoutGrid, Menu } from '@lucide/vue'
import { h } from 'vue'

const options = [
  { label: 'List', value: 'List', icon: h(Menu) },
  { label: 'Kanban', value: 'Kanban', icon: h(LayoutGrid) },
]

const options2 = [
  { label: 'List', value: 'List' },
  { label: 'Kanban', value: 'Kanban' },
]
</script>

<template>
  <sue-segmented :options="options" />
  <br>
  <br>
  <sue-segmented :options="options2">
    <template #iconRender="{ value }">
      <template v-if="value === 'List'">
        <Menu />
      </template>
      <template v-else-if="value === 'Kanban'">
        <LayoutGrid />
      </template>
    </template>
  </sue-segmented>
</template>
```
