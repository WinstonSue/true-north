# placement

## Description (en-US)

Customize animation placement, providing four preset placement: `top`, `right`, `bottom`, `left`, the `top` position by default.

## Source

```vue
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { MessageSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@lucide/vue'

const BOX_SIZE = 100
const BUTTON_SIZE = 40

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
}

const boxStyle: CSSProperties = {
  width: `${BOX_SIZE}px`,
  height: `${BOX_SIZE}px`,
  position: 'relative',
}

const insetInlineEnd = [
  (BOX_SIZE - BUTTON_SIZE) / 2,
  -(BUTTON_SIZE / 2),
  (BOX_SIZE - BUTTON_SIZE) / 2,
  BOX_SIZE - BUTTON_SIZE / 2,
]

const bottom = [
  BOX_SIZE - BUTTON_SIZE / 2,
  (BOX_SIZE - BUTTON_SIZE) / 2,
  -BUTTON_SIZE / 2,
  (BOX_SIZE - BUTTON_SIZE) / 2,
]

const placements = ['top', 'right', 'bottom', 'left'] as const
const icons = [ChevronUp, ChevronRight, ChevronDown, ChevronLeft]
</script>

<template>
  <sue-flex justify="space-evenly" align="center" :style="wrapperStyle">
    <div :style="boxStyle">
      <sue-float-button-group
        v-for="(placement, i) in placements"
        :key="placement"
        trigger="click"
        :placement="placement"
        :style="{
          position: 'absolute',
          insetInlineEnd: `${insetInlineEnd[i]}px`,
          bottom: `${bottom[i]}px`,
        }"
      >
        <template #icon>
          <component :is="icons[i]" />
        </template>
        <sue-float-button />
        <sue-float-button>
          <template #icon>
            <MessageSquare />
          </template>
        </sue-float-button>
      </sue-float-button-group>
    </div>
  </sue-flex>
</template>
```
