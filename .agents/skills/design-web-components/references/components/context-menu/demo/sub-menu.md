# Cascading menu

## Description (en-US)

The menu has multiple levels.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { theme } from '@sue/design-web-vue'

const items: MenuItemType[] = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
      },
      {
        key: '1-2',
        label: '2nd menu item',
      },
    ],
  },
  {
    key: '2',
    label: 'sub menu',
    children: [
      {
        key: '2-1',
        label: '3rd menu item',
      },
      {
        key: '2-2',
        label: '4th menu item',
      },
    ],
  },
  {
    key: '3',
    label: 'disabled sub menu',
    disabled: true,
    children: [
      {
        key: '3-1',
        label: '5d menu item',
      },
      {
        key: '3-2',
        label: '6th menu item',
      },
    ],
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
