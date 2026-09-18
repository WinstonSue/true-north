# Collapsed inline menu

## Description (en-US)

Inline menu could be collapsed.

Here is [a complete demo](../../layout/docs.md/#layout-demo-side) with sider layout.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { LayoutGrid, Box, Monitor, Mail, PanelLeftClose, PanelLeftOpen, ChartPie } from '@lucide/vue'
import { ref } from 'vue'

const collapsed = ref(false)

function toggleCollapsed() {
  collapsed.value = !collapsed.value
}

const items: MenuItemType[] = [
  { key: '1', icon: ChartPie, label: 'Option 1' },
  { key: '2', icon: Monitor, label: 'Option 2' },
  { key: '3', icon: Box, label: 'Option 3' },
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: Mail,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: LayoutGrid,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '11', label: 'Option 11' },
          { key: '12', label: 'Option 12' },
        ],
      },
    ],
  },
]
</script>

<template>
  <div style="width: 256px">
    <sue-button
      type="primary"
      style="margin-bottom: 16px"
      @click="toggleCollapsed"
    >
      <PanelLeftOpen v-if="collapsed" />
      <PanelLeftClose v-else />
    </sue-button>
    <sue-menu
      :default-selected-keys="['1']"
      :default-open-keys="['sub1']"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :items="items"
    />
  </div>
</template>
```
