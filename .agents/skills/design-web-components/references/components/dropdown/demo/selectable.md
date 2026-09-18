# Selectable Menu

## Description (en-US)

Configure the `selectable` property in `menu` to enable selectable ability.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown } from '@lucide/vue'

const items: MenuItemType[] = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
]
</script>

<template>
  <sue-dropdown
    :menu="{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }"
  >
    <a>
      <sue-space>
        Selectable
        <ChevronDown />
      </sue-space>
    </a>
  </sue-dropdown>
</template>
```
