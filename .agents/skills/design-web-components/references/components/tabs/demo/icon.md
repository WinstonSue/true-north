# Icon

## Description (en-US)

The Tab with Icon.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from '@sue/design-web-vue'
import { Smartphone, MonitorSmartphone } from '@lucide/vue'
import { h } from 'vue'

const icons = [MonitorSmartphone, Smartphone]

const items: TabsProps['items'] = icons.map((Icon, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Tab ${id}`,
    icon: () => h(Icon),
  }
})
</script>

<template>
  <sue-tabs default-active-key="2" :items="items" />
</template>
```
