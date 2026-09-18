# Extra node

## Description (en-US)

The dropdown menu with shortcut.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { ChevronDown, Settings } from '@lucide/vue'

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
</script>

<template>
  <sue-dropdown :menu="{ items }">
    <a @click.prevent>
      <sue-space>
        Hover me
        <ChevronDown />
      </sue-space>
    </a>
  </sue-dropdown>
</template>
```
