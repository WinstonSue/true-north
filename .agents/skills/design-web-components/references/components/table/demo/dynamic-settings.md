# Dynamic Settings

## Description (en-US)

Select different settings to see the result.

<style>
.table-demo-control-bar .sue-form-item {
  margin-inline-end: 16px !important;
  margin-bottom: 8px !important;
}
</style>

## Source

```vue
<script setup lang="ts">
import type { TableProps } from '@sue/design-web-vue'
import { ChevronDown } from '@lucide/vue'
import { computed, ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  address: string
  description: string
}

type SizeType = TableProps['size']
type TablePagination = NonNullable<Exclude<TableProps['pagination'], boolean>>
type TablePaginationPlacement = NonNullable<TablePagination['placement']>[number]
type ExpandableConfig = TableProps['expandable']
type TableRowSelection = TableProps['rowSelection']

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    onFilter: (value, record) => record.address.indexOf(value as string) === 0,
  },
  {
    title: 'Action',
    key: 'action',
    sorter: true,
  },
]

const dataSource = Array.from({ length: 10 }).map<DataType>((_, i) => ({
  key: i,
  name: 'John Brown',
  age: Number(`${i}2`),
  address: `New York No. ${i} Lake Park`,
  description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
}))

const defaultExpandable: ExpandableConfig = {
  expandedRowRender: record => record.description,
}

const bordered = ref(false)
const loading = ref(false)
const size = ref<SizeType>('large')
const expandableEnabled = ref(true)
const showTitle = ref(false)
const showHeader = ref(true)
const showFooter = ref(true)
const rowSelectionEnabled = ref(true)
const hasData = ref(true)
const tableLayout = ref<'unset' | 'fixed'>('unset')
const top = ref<TablePaginationPlacement>('none')
const bottom = ref<TablePaginationPlacement>('bottomEnd')
const ellipsis = ref(false)
const yScroll = ref(false)
const xScroll = ref<'unset' | 'scroll' | 'fixed'>('unset')

const scroll = computed(() => {
  const next: { x?: number | string, y?: number | string } = {}
  if (yScroll.value) {
    next.y = 240
  }
  if (xScroll.value !== 'unset') {
    next.x = '120vw'
  }
  return next
})

const tableColumns = computed<TableProps['columns']>(() => {
  const next = columns.map(column => ({
    ...column,
    ellipsis: ellipsis.value,
  }))

  if (xScroll.value === 'fixed') {
    if (next[0]) {
      next[0].fixed = true
    }
    if (next.length > 0) {
      next[next.length - 1]!.fixed = 'right'
    }
  }

  return next as TableProps['columns']
})

const expandable = computed<ExpandableConfig | undefined>(() => (
  expandableEnabled.value ? defaultExpandable : undefined
))
const rowSelection = computed<TableRowSelection | undefined>(() => (
  rowSelectionEnabled.value ? {} : undefined
))
const tableData = computed(() => (hasData.value ? dataSource : []))
const pagination = computed<TableProps['pagination']>(() => ({
  placement: [top.value, bottom.value],
}))

function handleAction() {}
</script>

<template>
  <sue-form layout="inline" class="table-demo-control-bar" style="margin-bottom: 16px">
    <sue-form-item label="Bordered">
      <sue-switch v-model:checked="bordered" />
    </sue-form-item>
    <sue-form-item label="loading">
      <sue-switch v-model:checked="loading" />
    </sue-form-item>
    <sue-form-item label="Title">
      <sue-switch v-model:checked="showTitle" />
    </sue-form-item>
    <sue-form-item label="Column Header">
      <sue-switch v-model:checked="showHeader" />
    </sue-form-item>
    <sue-form-item label="Footer">
      <sue-switch v-model:checked="showFooter" />
    </sue-form-item>
    <sue-form-item label="Expandable">
      <sue-switch v-model:checked="expandableEnabled" />
    </sue-form-item>
    <sue-form-item label="Checkbox">
      <sue-switch v-model:checked="rowSelectionEnabled" />
    </sue-form-item>
    <sue-form-item label="Fixed Header">
      <sue-switch v-model:checked="yScroll" />
    </sue-form-item>
    <sue-form-item label="Has Data">
      <sue-switch v-model:checked="hasData" />
    </sue-form-item>
    <sue-form-item label="Ellipsis">
      <sue-switch v-model:checked="ellipsis" />
    </sue-form-item>
    <sue-form-item label="Size">
      <sue-radio-group v-model:value="size">
        <sue-radio-button value="large">
          Large
        </sue-radio-button>
        <sue-radio-button value="medium">
          Middle
        </sue-radio-button>
        <sue-radio-button value="small">
          Small
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Table Scroll">
      <sue-radio-group v-model:value="xScroll">
        <sue-radio-button value="unset">
          Unset
        </sue-radio-button>
        <sue-radio-button value="scroll">
          Scroll
        </sue-radio-button>
        <sue-radio-button value="fixed">
          Fixed Columns
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Table Layout">
      <sue-radio-group v-model:value="tableLayout">
        <sue-radio-button value="unset">
          Unset
        </sue-radio-button>
        <sue-radio-button value="fixed">
          Fixed
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Pagination Top">
      <sue-radio-group v-model:value="top">
        <sue-radio-button value="topStart">
          TopStart
        </sue-radio-button>
        <sue-radio-button value="topCenter">
          TopCenter
        </sue-radio-button>
        <sue-radio-button value="topEnd">
          TopEnd
        </sue-radio-button>
        <sue-radio-button value="none">
          None
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
    <sue-form-item label="Pagination Bottom">
      <sue-radio-group v-model:value="bottom">
        <sue-radio-button value="bottomStart">
          BottomStart
        </sue-radio-button>
        <sue-radio-button value="bottomCenter">
          BottomCenter
        </sue-radio-button>
        <sue-radio-button value="bottomEnd">
          BottomEnd
        </sue-radio-button>
        <sue-radio-button value="none">
          None
        </sue-radio-button>
      </sue-radio-group>
    </sue-form-item>
  </sue-form>
  <sue-table
    :bordered="bordered"
    :loading="loading"
    :size="size"
    :row-selection="rowSelection"
    :expandable="expandable"
    :scroll="scroll"
    :table-layout="tableLayout === 'unset' ? undefined : tableLayout"
    :show-header="showHeader"
    :columns="tableColumns"
    :data-source="tableData"
    :pagination="pagination"
  >
    <template v-if="showTitle" #title>
      Here is title
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <sue-space size="medium">
          <a @click.prevent="handleAction">Delete</a>
          <a @click.prevent="handleAction">
            <sue-space>
              More actions
              <ChevronDown />
            </sue-space>
          </a>
        </sue-space>
      </template>
    </template>
    <template v-if="showFooter" #footer>
      Here is footer
    </template>
  </sue-table>
</template>
```
