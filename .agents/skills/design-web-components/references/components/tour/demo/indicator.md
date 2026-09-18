# Custom indicator

## Description (en-US)

Custom indicator.

## Source

```vue
<script setup lang="ts">
import type { TourStepItem } from '@sue/design-web-vue'
import { Ellipsis } from '@lucide/vue'
import { shallowRef } from 'vue'

const ref1 = shallowRef()
const ref2 = shallowRef()
const ref3 = shallowRef()
const open = shallowRef(false)

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: ref1,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: ref2,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: ref3,
  },
]

function indicatorsRender(current: number, total: number) {
  return `${current + 1} / ${total}`
}
</script>

<template>
  <sue-button type="primary" @click="open = true">
    Begin Tour
  </sue-button>
  <sue-divider />
  <sue-space>
    <sue-button ref="ref1">
      Upload
    </sue-button>
    <sue-button ref="ref2" type="primary">
      Save
    </sue-button>
    <sue-button ref="ref3">
      <template #icon>
        <Ellipsis />
      </template>
    </sue-button>
  </sue-space>
  <sue-tour
    v-model:open="open"
    :steps="steps"
    :indicators-render="indicatorsRender"
  />
</template>
```
