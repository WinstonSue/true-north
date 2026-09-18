# Click event

## Description (en-US)

An event will be triggered when you click menu items, in which you can make different operations according to item's key.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown } from '@lucide/vue'
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function onClick({ key }: any) {
  messageApi.info(`Click on item ${key}`)
}

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
]
</script>

<template>
  <ContextHolder />
  <sue-dropdown :menu="{ items }" @menu-click="onClick">
    <a @click.prevent>
      <sue-space>
        Hover me, Click menu item
        <ChevronDown />
      </sue-space>
    </a>
  </sue-dropdown>
</template>
```
