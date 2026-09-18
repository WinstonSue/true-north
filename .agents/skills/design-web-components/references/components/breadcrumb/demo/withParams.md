# With Params

## Description (en-US)

With route params.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType } from '@sue/design-web-vue'

const items: BreadcrumbItemType[] = [
  {
    title: 'Users',
  },
  {
    title: ':id',
    href: '',
  },
]
</script>

<template>
  <sue-breadcrumb :items="items" :params="{ id: 1 }" />
</template>
```
