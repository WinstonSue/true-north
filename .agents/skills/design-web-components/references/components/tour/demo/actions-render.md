# Custom action

## Description (en-US)

Custom action.

## Source

```vue
<script setup lang="ts">
import type { TourStepItem } from '@sue/design-web-vue'
import { Ellipsis } from '@lucide/vue'
import { Button } from '@sue/design-web-vue'
import { h, shallowRef } from 'vue'

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

function actionsRender(originNode: any, info: { current: number, total: number }) {
  const nodes: any[] = []
  if (info.current !== info.total - 1) {
    nodes.push(
      h(
        Button,
        {
          size: 'small',
          onClick: () => {
            open.value = false
          },
        },
        {
          default: () => 'Skip',
        },
      ),
    )
  }
  if (Array.isArray(originNode)) {
    nodes.push(...originNode)
  }
  else {
    nodes.push(originNode)
  }
  return nodes
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
    :actions-render="actionsRender"
  />
</template>
```
