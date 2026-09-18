# Sticky Header

## Description (en-US)

For long table，need to scroll to view the header and scroll bar，then you can now set the fixed header and scroll bar to follow the page.

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'
import { ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'start',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'start',
  },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
  { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'end',
    width: 100,
  },
]

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}))

const fixedTop = ref(false)
</script>

<template>
  <sue-table
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ x: 1500 }"
    :sticky="{ offsetHeader: 64 }"
  >
    <template #summary>
      <sue-table-summary :fixed="fixedTop ? 'top' : 'bottom'">
        <sue-table-summary-row>
          <sue-table-summary-cell :index="0" :col-span="2">
            <sue-switch
              v-model:checked="fixedTop"
              checked-children="Fixed Top"
              un-checked-children="Fixed Top"
            />
          </sue-table-summary-cell>
          <sue-table-summary-cell :index="2" :col-span="8">
            Scroll Context
          </sue-table-summary-cell>
          <sue-table-summary-cell :index="10">
            Fix Right
          </sue-table-summary-cell>
        </sue-table-summary-row>
      </sue-table-summary>
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>action</a>
      </template>
    </template>
  </sue-table>
</template>
```
