# Switch the menu type

## Description (en-US)

Show the dynamic switching mode (between `inline` and `vertical`).

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from '@sue/design-web-vue'
import { LayoutGrid, Calendar, Link, Mail, Settings } from '@lucide/vue'
import { h, ref } from 'vue'

const mode = ref<'vertical' | 'inline'>('inline')
const theme = ref<'dark' | 'light'>('light')

const items: MenuItemType[] = [
  {
    key: '1',
    icon: Mail,
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: Calendar,
    label: 'Navigation Two',
  },
  {
    key: 'sub1',
    label: 'Navigation Two',
    icon: LayoutGrid,
    children: [
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
      {
        key: 'sub1-2',
        label: 'Submenu',
        children: [
          { key: '5', label: 'Option 5' },
          { key: '6', label: 'Option 6' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Three',
    icon: Settings,
    children: [
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
    ],
  },
  {
    key: 'link',
    icon: Link,
    label: h(
      'a',
      {
        href: 'https://ant.design',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Antdv Next',
    ),
  },
]

function changeMode(value: boolean) {
  mode.value = value ? 'vertical' : 'inline'
}

function changeTheme(value: boolean) {
  theme.value = value ? 'dark' : 'light'
}
</script>

<template>
  <sue-switch :checked="mode === 'vertical'" @change="changeMode" />
  Change Mode
  <sue-divider type="vertical" />
  <sue-switch :checked="theme === 'dark'" @change="changeTheme" />
  Change Style
  <br>
  <br>
  <sue-menu
    style="width: 256px"
    :default-selected-keys="['1']"
    :default-open-keys="['sub1']"
    :mode="mode"
    :theme="theme"
    :items="items"
  />
</template>
```
