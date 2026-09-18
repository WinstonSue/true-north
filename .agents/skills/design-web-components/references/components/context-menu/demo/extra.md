# Extra node

## Description (en-US)

The context menu with shortcut.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { Settings } from '@lucide/vue'
import { theme } from '@sue/design-web-vue'

const items: MenuItemType[] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: Settings,
    extra: '⌘S',
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
