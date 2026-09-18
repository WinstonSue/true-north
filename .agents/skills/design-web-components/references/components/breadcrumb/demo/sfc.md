# SFC Mode

## Description (en-US)

Support SFC mode using `sue-breadcrumb-item` and `sue-breadcrumb-separator` with dropdown menu.

## Source

```vue
<script setup lang="ts">
import { h } from 'vue'

const menuItems = [
  {
    key: '1',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.alipay.com/' }, 'General'),
  },
  {
    key: '2',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.taobao.com/' }, 'Layout'),
  },
  {
    key: '3',
    label: h('a', { target: '_blank', rel: 'noopener noreferrer', href: 'http://www.tmall.com/' }, 'Navigation'),
  },
]
</script>

<template>
  <sue-breadcrumb separator="">
    <sue-breadcrumb-item>
      Antdv Next
    </sue-breadcrumb-item>
    <sue-breadcrumb-separator>
      >
    </sue-breadcrumb-separator>
    <sue-breadcrumb-item href="">
      Component
    </sue-breadcrumb-item>
    <sue-breadcrumb-separator />
    <sue-breadcrumb-item href="" :menu="{ items: menuItems }">
      General
    </sue-breadcrumb-item>
    <sue-breadcrumb-separator />
    <sue-breadcrumb-item>
      Button
    </sue-breadcrumb-item>
  </sue-breadcrumb>
</template>
```
