# With an Icon

## Description (en-US)

The icon should be placed in front of the text.

## Source

```vue
<script lang="ts" setup>
import type { BreadcrumbItemType } from '@sue/design-web-vue'
import { House, User } from '@lucide/vue'

const items: BreadcrumbItemType[] = [
  {
    href: '',
  },
  {
    href: '',
  },
  {
    title: 'Application',
  },
]
</script>

<template>
  <sue-breadcrumb :items="items">
    <template #titleRender="{ index }">
      <template v-if="index === 0">
        <House />
      </template>
      <template v-if="index === 1">
        <User />
        <span>Application List</span>
      </template>
    </template>
  </sue-breadcrumb>
</template>
```
