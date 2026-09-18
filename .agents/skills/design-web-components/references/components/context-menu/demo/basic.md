# Basic

## Description (en-US)

The most basic context menu. The pop-up position follows the right-click coordinates.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'

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
  <sue-context-menu :menu="{ items }">
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
