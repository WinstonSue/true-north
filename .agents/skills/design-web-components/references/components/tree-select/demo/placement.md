# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import type { TreeSelectProps } from '@sue/design-web-vue'
import { ref, shallowRef } from 'vue'

type Placement = NonNullable<TreeSelectProps['placement']>

const placement = shallowRef<Placement>('topLeft')
const value = ref<string>()

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
            title: 'leaf1',
          },
          {
            value: 'leaf2',
            title: 'leaf2',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'leaf3',
            title: 'leaf3',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <sue-radio-group v-model:value="placement">
    <sue-radio-button value="topLeft">
      topLeft
    </sue-radio-button>
    <sue-radio-button value="topRight">
      topRight
    </sue-radio-button>
    <sue-radio-button value="bottomLeft">
      bottomLeft
    </sue-radio-button>
    <sue-radio-button value="bottomRight">
      bottomRight
    </sue-radio-button>
  </sue-radio-group>
  <br>
  <br>
  <sue-tree-select
    v-model:value="value"
    show-search
    :styles="{
      popup: {
        root: {
          maxHeight: '400px',
          overflow: 'auto',
          minWidth: '300px',
        },
      },
    }"
    placeholder="Please select"
    :popup-match-select-width="false"
    :placement="placement"
    allow-clear
    tree-default-expand-all
    :tree-data="treeData"
  />
</template>
```
