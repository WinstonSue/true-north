# Prefix and Suffix

## Description (en-US)

Custom `prefix` and `suffixIcon`.

## Source

```vue
<script setup lang="ts">
import type { TreeSelectEmits } from '@sue/design-web-vue'
import { Smile } from '@lucide/vue'
import { ref } from 'vue'

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
          {
            value: 'leaf2',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'sss',
            title: 'sss',
          },
        ],
      },
    ],
  },
]

const value = ref<string>()

const onChange: TreeSelectEmits['change'] = (newValue) => {
  console.log(newValue)
}
</script>

<template>
  <sue-tree-select
    v-model:value="value"
    show-search
    style="width: 100%"
    :styles="{
      popup: {
        root: {
          maxHeight: '400px',
          overflow: 'auto',
        },
      },
    }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    @change="onChange"
  >
    <template #suffixIcon>
      <Smile />
    </template>
  </sue-tree-select>
  <br>
  <br>
  <sue-tree-select
    v-model:value="value"
    show-search
    prefix="Prefix"
    style="width: 100%"
    :styles="{
      popup: {
        root: {
          maxHeight: '400px',
          overflow: 'auto',
        },
      },
    }"
    placeholder="Please select"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
    @change="onChange"
  />
</template>
```
