# Component size

## Description (en-US)

Config component size globally.

## Source

```vue
<script setup lang="ts">
import type { ConfigProviderProps, TableProps } from '@sue/design-web-vue'
import { ref } from 'vue'

type SizeType = ConfigProviderProps['componentSize']

const componentSize = ref<SizeType>('small')

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
]

const dataSource = [
  { key: '1', name: 'John Brown', age: 32 },
  { key: '2', name: 'Jim Green', age: 42 },
  { key: '3', name: 'Joe Black', age: 32 },
]

const tabItems = [
  {
    label: 'Tab 1',
    key: '1',
    children: 'Content of Tab Pane 1',
  },
  {
    label: 'Tab 2',
    key: '2',
    children: 'Content of Tab Pane 2',
  },
  {
    label: 'Tab 3',
    key: '3',
    children: 'Content of Tab Pane 3',
  },
]
</script>

<template>
  <sue-radio-group v-model:value="componentSize">
    <sue-radio-button value="small">
      Small
    </sue-radio-button>
    <sue-radio-button value="medium">
      Medium
    </sue-radio-button>
    <sue-radio-button value="large">
      Large
    </sue-radio-button>
  </sue-radio-group>
  <sue-divider />
  <sue-config-provider :component-size="componentSize">
    <sue-space vertical :size="[0, 16]" style="width: 100%">
      <sue-input />
      <sue-tabs default-active-key="1" :items="tabItems" />
      <sue-input-search allow-clear />
      <sue-textarea allow-clear />
      <sue-select default-value="demo" :options="[{ value: 'demo' }]" />
      <sue-date-picker />
      <sue-range-picker />
      <sue-button>Button</sue-button>
      <sue-card title="Card">
        <sue-table :columns="columns" :data-source="dataSource" />
      </sue-card>
    </sue-space>
  </sue-config-provider>
</template>
```
