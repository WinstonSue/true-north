# autoSize

## Description (en-US)

Height autoSize.

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
  <sue-mentions auto-size style="width: 100%" :options="options" />
</template>
```
