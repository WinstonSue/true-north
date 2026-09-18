# Horizontal

## Description (en-US)

Horizontal layout.

## Source

```vue
<script setup lang="ts">
const items = [
  {
    content: 'Init',
  },
  {
    content: 'Start',
  },
  {
    content: 'Pending',
  },
  {
    content: 'Complete',
  },
]
</script>

<template>
  <sue-flex vertical>
    <sue-timeline mode="start" orientation="horizontal" :items="items" />
    <sue-divider />
    <sue-timeline mode="right" orientation="horizontal" :items="items" />
    <sue-divider />
    <sue-timeline mode="alternate" orientation="horizontal" :items="items" />
  </sue-flex>
</template>
```
