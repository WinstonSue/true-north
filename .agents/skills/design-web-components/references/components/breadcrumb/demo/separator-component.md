# Configuring the Separator Independently

## Description (en-US)

Customize separator for each other.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType } from '@sue/design-web-vue'

const items: BreadcrumbItemType[] = [
  {
    title: 'Location',
  },
  {
    type: 'separator',
    separator: ':',
  },
  {
    href: '',
    title: 'Application Center',
  },
  {
    type: 'separator',
  },
  {
    href: '',
    title: 'Application List',
  },
  {
    type: 'separator',
  },
  {
    title: 'An Application',
  },
]
</script>

<template>
  <sue-breadcrumb separator="" :items="items" />
</template>
```
