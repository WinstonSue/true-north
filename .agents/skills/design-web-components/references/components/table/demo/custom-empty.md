# Custom Empty

## Description (en-US)

Custom empty status.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]
</script>

<template>
  <sue-table :columns="columns" :data-source="[]">
    <template #emptyText>
      <div class="table-empty color-text-tertiary px-8px py-0">
        No data yet
      </div>
    </template>
  </sue-table>
</template>
```
