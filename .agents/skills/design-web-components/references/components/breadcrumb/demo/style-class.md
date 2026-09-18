# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbProps } from '@sue/design-web-vue'

const classesObject = {
  root: 'demo-breadcrumb-root',
  item: 'demo-breadcrumb-item',
  separator: 'demo-breadcrumb-separator',
}

const stylesObject: BreadcrumbProps['styles'] = {
  root: { border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px' },
  item: { color: '#1890ff' },
  separator: { color: 'rgba(0, 0, 0, 0.45)' },
}

const stylesFn: BreadcrumbProps['styles'] = (info) => {
  const items = info.props.items || []
  if (items.length > 2) {
    return {
      root: { border: '1px solid #F5EFFF', padding: '8px', borderRadius: '4px' },
      item: { color: '#8F87F1' },
    }
  }
  return {}
}

const items = [
  { title: 'Antdv Next' },
  { title: 'Component' },
  { title: 'Breadcrumb' },
]
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-breadcrumb
      :classes="classesObject"
      :items="items.slice(0, 2)"
      :styles="stylesObject"
      aria-label="Breadcrumb with Object"
    />
    <sue-breadcrumb
      :classes="classesObject"
      :items="items"
      :styles="stylesFn"
      aria-label="Breadcrumb with Function"
    />
  </sue-flex>
</template>

<style scoped>
.demo-breadcrumb-root {
  padding: 8px;
  border-radius: 4px;
}

.demo-breadcrumb-item {
  color: #1890ff;
}

.demo-breadcrumb-separator {
  color: rgba(0, 0, 0, 0.45);
}
</style>
```
