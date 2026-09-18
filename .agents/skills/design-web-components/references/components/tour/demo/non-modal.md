# Non-modal

## Description (en-US)

Use `mask={false}` to make Tour non-modal. At the meantime it is recommended to use with `type="primary"` to emphasize the guide itself.

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
</script>

<template>
  <sue-button type="primary" @click="open = true">
    Begin non-modal Tour
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
  <sue-tour v-model:open="open" :steps="steps" type="primary" :mask="false">
    <template #coverRender="{ index }">
      <template v-if="index === 0">
        <img
          draggable="false"
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        >
      </template>
    </template>
  </sue-tour>
</template>
```
