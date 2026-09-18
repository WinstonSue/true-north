# The way of hiding menu

## Description (en-US)

The default is to close the menu when you click on menu items, this feature can be turned off.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown } from '@lucide/vue'
import { ref } from 'vue'

const open = ref(false)

const items: MenuItemType[] = [
  {
    label: 'Clicking me will not close the menu.',
    key: '1',
  },
  {
    label: 'Clicking me will not close the menu also.',
    key: '2',
  },
  {
    label: 'Clicking me will close the menu.',
    key: '3',
  },
]

function handleMenuClick(info: { key: string }) {
  if (info.key === '3') {
    open.value = false
  }
}

function handleOpenChange(nextOpen: boolean, info: { source: 'trigger' | 'menu' }) {
  if (info.source === 'trigger' || nextOpen) {
    open.value = nextOpen
  }
}
</script>

<template>
  <sue-dropdown
    :menu="{ items, onClick: handleMenuClick }"
    :open="open"
    @open-change="handleOpenChange"
  >
    <a @click.prevent>
      <sue-space>
        Hover me
        <ChevronDown />
      </sue-space>
    </a>
  </sue-dropdown>
</template>
```
