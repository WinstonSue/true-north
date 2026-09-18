# Placement

## Description (en-US)

Change the suggestions placement.

## Source

```vue
<script setup lang="ts">
import type { MentionsProps } from '@sue/design-web-vue'

const options: MentionsProps['options'] = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
]
</script>

<template>
  <sue-mentions style="width: 100%" placement="top" :options="options" />
</template>
```
