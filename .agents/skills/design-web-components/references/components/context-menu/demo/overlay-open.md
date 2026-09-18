# The way of hiding menu

## Description (en-US)

The default is to close the menu when you click on menu items, this feature can be turned off.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'
import { computed, ref } from 'vue'

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

const { token } = theme.useToken()

const areaStyle = computed(() => ({
  color: token.value.colorTextTertiary,
  background: token.value.colorBgLayout,
  height: '200px',
  textAlign: 'center',
  lineHeight: '200px',
}))
</script>

<template>
  <sue-context-menu
    :menu="{ items, onClick: handleMenuClick }"
    :open="open"
    @open-change="handleOpenChange"
  >
    <div :style="areaStyle">
      Right Click on here
    </div>
  </sue-context-menu>
</template>
```
