# Responsive

## Description (en-US)

Responsive columns.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  { title: 'Name (all screens)', dataIndex: 'name', key: 'name' },
  { title: 'Age (medium screen or bigger)', dataIndex: 'age', key: 'age', responsive: ['md'] },
  { title: 'Address (large screen or bigger)', dataIndex: 'address', key: 'address', responsive: ['lg'] },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
]
</script>

<template>
  <sue-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </sue-table>
</template>
```
