# Show copywriting

## Description (en-US)

Add copywriting in rate components.

## Source

```vue
<script setup lang="ts">
import type { RateProps } from '@sue/design-web-vue'
import { ref } from 'vue'

function getDescTitle(value: number, desc: RateProps['tooltips']) {
  const item = desc?.[value - 1]
  return typeof item === 'object' ? item.title : item
}
const desc: RateProps['tooltips'] = [
  'terrible',
  { placement: 'top', title: 'bad', trigger: 'hover' },
  'normal',
  'good',
  'wonderful',
]
const value = ref(3)
</script>

<template>
  <sue-flex gap="middle" vertical>
    <sue-rate v-model:value="value" :tooltips="desc" />
    <template v-if="value">
      <span>{{ getDescTitle(value, desc) }}</span>
    </template>
  </sue-flex>
</template>
```
