# Click event

## Description (en-US)

An event will be triggered when you click menu items, in which you can make different operations according to item's key.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { message, theme } from '@sue/design-web-vue'

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

const { token } = theme.useToken()
</script>

<template>
  <ContextHolder />
  <sue-context-menu :menu="{ items }" @menu-click="onClick">
    <div
      :style="{
        color: token.colorTextTertiary,
        background: token.colorBgLayout,
        height: '200px',
        textAlign: 'center',
        lineHeight: '200px',
      }"
    >
      Right Click on here
    </div>
  </sue-context-menu>
</template>
```
