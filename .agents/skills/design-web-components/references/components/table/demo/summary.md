# Summary

## Description (en-US)

Set summary content by `summary` prop. Sync column fixed status with `Table.Summary.Cell`. You can fixed it by set `Table.Summary` `fixed` prop(since `4.16.0`).

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'

interface DataType {
  key: string
  name: string
  borrow: number
  repayment: number
}

interface FixedDataType {
  key: number
  name: string
  description: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Borrow', dataIndex: 'borrow', key: 'borrow' },
  { title: 'Repayment', dataIndex: 'repayment', key: 'repayment' },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', borrow: 10, repayment: 33 },
  { key: '2', name: 'Jim Green', borrow: 100, repayment: 0 },
  { key: '3', name: 'Joe Black', borrow: 10, repayment: 10 },
  { key: '4', name: 'Jim Red', borrow: 75, repayment: 45 },
]

const fixedColumns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', fixed: true, width: 100 },
  { title: 'Description', dataIndex: 'description' },
]

const fixedDataSource = Array.from({ length: 20 }).map<FixedDataType>((_, i) => ({
  key: i,
  name: ['Light', 'Bamboo', 'Little'][i % 3]!,
  description: 'Everything that has a beginning, has an end.',
}))
</script>

<template>
  <sue-flex vertical gap="small">
    <sue-table
      bordered
      class="custom-summary-table"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    >
      <template #summary="pageData">
        <sue-table-summary>
          <sue-table-summary-row>
            <sue-table-summary-cell :index="0">
              Total
            </sue-table-summary-cell>
            <sue-table-summary-cell :index="1">
              <sue-editable-text type="danger">
                {{ pageData.reduce((sum, item) => sum + item.borrow, 0) }}
              </sue-editable-text>
            </sue-table-summary-cell>
            <sue-table-summary-cell :index="2">
              <sue-editable-text>
                {{ pageData.reduce((sum, item) => sum + item.repayment, 0) }}
              </sue-editable-text>
            </sue-table-summary-cell>
          </sue-table-summary-row>
          <sue-table-summary-row>
            <sue-table-summary-cell :index="0">
              Balance
            </sue-table-summary-cell>
            <sue-table-summary-cell :index="1" :col-span="2">
              <sue-editable-text type="danger">
                {{ pageData.reduce((sum, item) => sum + item.borrow - item.repayment, 0) }}
              </sue-editable-text>
            </sue-table-summary-cell>
          </sue-table-summary-row>
        </sue-table-summary>
      </template>
    </sue-table>
    <sue-table
      bordered
      class="custom-summary-table"
      :columns="fixedColumns"
      :data-source="fixedDataSource"
      :pagination="false"
      :scroll="{ x: 2000, y: 500 }"
    >
      <template #summary>
        <sue-table-summary fixed>
          <sue-table-summary-row>
            <sue-table-summary-cell :index="0">
              Summary
            </sue-table-summary-cell>
            <sue-table-summary-cell :index="1">
              This is a summary content
            </sue-table-summary-cell>
          </sue-table-summary-row>
        </sue-table-summary>
      </template>
    </sue-table>
  </sue-flex>
</template>

<style>
.custom-summary-table .sue-table-body,
.custom-summary-table .sue-table-content {
  scrollbar-width: thin;
  scrollbar-color: #eaeaea transparent;
}
</style>
```
