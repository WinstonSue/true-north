# Disabled

## Description (en-US)

Disabled a tab.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from '@sue/design-web-vue'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    content: 'Tab 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    content: 'Tab 2',
    disabled: true,
  },
  {
    key: '3',
    label: 'Tab 3',
    content: 'Tab 3',
  },
]
</script>

<template>
  <sue-tabs default-active-key="1" :items="items" />
</template>
```
