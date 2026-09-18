# Show Tree Line

## Description (en-US)

Use `treeLine` to show the line style.

## Source

```vue
<script setup lang="ts">
import { ClipboardCheck } from '@lucide/vue'
import { h, ref } from 'vue'

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    icon: h(ClipboardCheck),
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        icon: h(ClipboardCheck),
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
            icon: h(ClipboardCheck),
          },
          {
            value: 'leaf2',
            title: 'leaf2',
            icon: h(ClipboardCheck),
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        icon: h(ClipboardCheck),
        children: [
          {
            value: 'sss',
            title: 'sss',
            icon: h(ClipboardCheck),
          },
        ],
      },
    ],
  },
]

const treeLine = ref(true)
const showLeafIcon = ref(false)
const showIcon = ref(false)
</script>

<template>
  <sue-space direction="vertical">
    <sue-switch
      v-model:checked="showIcon"
      checked-children="showIcon"
      un-checked-children="showIcon"
    />
    <sue-switch
      v-model:checked="treeLine"
      checked-children="treeLine"
      un-checked-children="treeLine"
    />
    <sue-switch
      v-model:checked="showLeafIcon"
      :disabled="!treeLine"
      checked-children="showLeafIcon"
      un-checked-children="showLeafIcon"
    />
    <sue-tree-select
      :tree-line="treeLine ? { showLeafIcon } : false"
      style="width: 300px"
      :tree-data="treeData"
      :tree-icon="showIcon"
    />
  </sue-space>
</template>
```
