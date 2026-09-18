# Hidden Columns

## Description (en-US)

Hide columns with `hidden`.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'
import { computed, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const baseColumns: TableProps['columns'] = [
  { title: 'Column 1', dataIndex: 'address', key: '1' },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6' },
  { title: 'Column 7', dataIndex: 'address', key: '7' },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
]

const defaultCheckedList = baseColumns.map(item => item?.key as string)
const checkedList = ref<string[]>(defaultCheckedList)

const options = baseColumns.map(({ key, title }) => ({
  label: title as string,
  value: key as string,
}))

const columns = computed(() =>
  baseColumns.map(item => ({
    ...item,
    hidden: !checkedList.value.includes(item?.key as string),
  })),
)

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York Park' },
  { key: '2', name: 'Jim Green', age: 40, address: 'London Park' },
]
</script>

<template>
  <div>
    <sue-divider>Columns displayed</sue-divider>
    <sue-checkbox-group
      v-model:value="checkedList"
      :options="options"
    />
    <sue-table
      :columns="columns"
      :data-source="dataSource"
      :style="{ marginTop: '24px' }"
    />
  </div>
</template>
```
