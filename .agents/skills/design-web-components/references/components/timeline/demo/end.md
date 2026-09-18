# Right Alternate

## Description (en-US)

End alternate timeline.

## Source

```vue
<script setup lang="ts">
import { Clock } from '@lucide/vue'
import { h } from 'vue'

const items = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
  },
  {
    icon: () => h(Clock),
    color: 'red',
    content: 'Technical testing 2015-09-01',
  },
  {
    content: 'Network problems being solved 2015-09-01',
  },
]
</script>

<template>
  <sue-timeline mode="right" :items="items" />
</template>
```
