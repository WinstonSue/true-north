# Custom highlighted area style

## Description (en-US)

Using `gap` to control the radius of highlight area and the offset between highlight area and the element.

## Source

```vue
<script setup lang="ts">
import type { TourStepItem } from '@sue/design-web-vue'
import { computed, ref, shallowRef } from 'vue'

const tourNodeRef = shallowRef()
const open = ref(false)

const radius = ref(8)
const offsetX = ref(2)
const offsetY = ref(2)
const offset = ref(2)
const offsetDirection = ref<'both' | 'individual'>('individual')

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: tourNodeRef,
  },
]

const gap = computed(() => {
  const offsetValue = offsetDirection.value === 'both'
    ? offset.value
    : [offsetX.value, offsetY.value]
  return {
    offset: offsetValue,
    radius: radius.value,
  } as {
    offset: number | [number, number]
    radius: number
  }
})
</script>

<template>
  <div ref="tourNodeRef">
    <sue-button type="primary" @click="open = true">
      Begin Tour
    </sue-button>
    <sue-space vertical style="display: flex; margin-top: 12px">
      <sue-row>
        <sue-col :span="6">
          <sue-editable-text>Radius:</sue-editable-text>
        </sue-col>
        <sue-col :span="12">
          <sue-slider v-model:value="radius" />
        </sue-col>
      </sue-row>
      <sue-row>
        <sue-col :span="6">
          <sue-editable-text>Offset:</sue-editable-text>
        </sue-col>
        <sue-col :span="12">
          <sue-slider
            v-model:value="offset"
            :max="50"
            @change="offsetDirection = 'both'"
          />
        </sue-col>
      </sue-row>
      <sue-row>
        <sue-col :span="6">
          <sue-editable-text>Horizontal offset:</sue-editable-text>
        </sue-col>
        <sue-col :span="12">
          <sue-slider
            v-model:value="offsetX"
            :max="50"
            @change="offsetDirection = 'individual'"
          />
        </sue-col>
      </sue-row>
      <sue-row>
        <sue-col :span="6">
          <sue-editable-text>Vertical offset:</sue-editable-text>
        </sue-col>
        <sue-col :span="12">
          <sue-slider
            v-model:value="offsetY"
            :max="50"
            @change="offsetDirection = 'individual'"
          />
        </sue-col>
      </sue-row>
    </sue-space>
    <sue-tour v-model:open="open" :steps="steps" :gap="gap" />
  </div>
</template>
```
