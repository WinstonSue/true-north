# Label

## Description (en-US)

Use `title` show time alone.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref<'start' | 'alternate' | 'end'>('start')

const items = [
  {
    title: '2015-09-01',
    content: 'Create a services',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Solve initial network problems',
  },
  {
    content: 'Technical testing',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Network problems being solved',
  },
]
</script>

<template>
  <div>
    <sue-radio-group v-model:value="mode" :style="{ marginBottom: '20px' }">
      <sue-radio value="start">
        Start
      </sue-radio>
      <sue-radio value="end">
        End
      </sue-radio>
      <sue-radio value="alternate">
        Alternate
      </sue-radio>
    </sue-radio-group>
    <sue-timeline :mode="mode" :items="items" />
  </div>
</template>
```
