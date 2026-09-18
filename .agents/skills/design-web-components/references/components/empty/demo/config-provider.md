# ConfigProvider

## Description (en-US)

Use ConfigProvider to customize empty content.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { h, ref } from 'vue'

const customize = ref(true)
const controlStyle = { width: '200px' }

function renderEmpty() {
  return h(
    'div',
    { style: { textAlign: 'center' } },
    [
      h(Smile, { style: { fontSize: '20px' } }),
      h('p', 'Data Not Found'),
    ],
  )
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const renderTransferItem = (item: any) => item.title
</script>

<template>
  <sue-switch
    v-model:checked="customize"
    checked-children="customize"
    un-checked-children="default"
  />
  <sue-divider />
  <sue-config-provider :render-empty="customize ? renderEmpty : undefined">
    <sue-space vertical style="width: 100%">
      <h4>Select</h4>
      <sue-select :style="controlStyle" />
      <h4>TreeSelect</h4>
      <sue-tree-select :style="controlStyle" :tree-data="[]" />
      <h4>Cascader</h4>
      <sue-cascader :style="controlStyle" :options="[]" show-search />
      <h4>Transfer</h4>
      <sue-transfer :data-source="[]" :target-keys="[]" :render="renderTransferItem" />
      <h4>Table</h4>
      <sue-table style="margin-top: 8px" :columns="columns" :data-source="[]" />
    </sue-space>
    <!--    <template #renderEmpty> -->
    <!--      <div style="text-align: center"> -->
    <!--        <Smile style="font-size: 20px" /> -->
    <!--        <p>Data Not Found</p> -->
    <!--      </div> -->
    <!--    </template> -->
  </sue-config-provider>
</template>
```
