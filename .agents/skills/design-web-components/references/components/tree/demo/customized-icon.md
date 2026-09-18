# Customize Icon

## Description (en-US)

You can customize icons for different nodes.

## Source

```vue
<script lang="ts" setup>
import type { TreeDataNode } from '@sue/design-web-vue'
import { ChevronDown, Frown, Meh, Smile } from '@lucide/vue'
import { h, ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: h(Smile),
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        icon: h(Meh),
      },
      {
        title: 'leaf',
        key: '0-0-1',
        icon: ({ selected }: TreeDataNode) => (selected ? h(Frown) : h(Frown)),
      },
    ],
  },
]
const selectedKeys = ref(['0-0-0'])
</script>

<template>
  <sue-tree v-model:selected-keys="selectedKeys" show-icon default-expand-all :tree-data="treeData">
    <template #switcherIcon>
      <ChevronDown />
    </template>
  </sue-tree>
</template>
```
