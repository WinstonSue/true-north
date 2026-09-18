# Resizable

## Description (en-US)

Resizable drawer that allows users to adjust the drawer's width or height by dragging the edge.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps, RadioChangeEvent } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const placement = shallowRef<DrawerProps['placement']>('right')
const size = shallowRef(256)

function onChange(e: RadioChangeEvent) {
  size.value = 256
  placement.value = e.target.value
}

function onClose() {
  open.value = false
}

function onResize(newSize: number | string) {
  if (typeof newSize === 'number')
    size.value = newSize
}
</script>

<template>
  <sue-space style="margin-bottom: 16px">
    <sue-radio-group
      v-model:value="placement"
      :options="['top', 'right', 'bottom', 'left'].map((pos) => ({ label: pos, value: pos }))"
      @change="onChange"
    />
    <sue-button type="primary" @click="() => open = true">
      Open Drawer
    </sue-button>
  </sue-space>
  <div>Current size: {{ size }}px</div>
  <sue-drawer
    v-model:open="open"
    title="Resizable Drawer"
    :placement="placement"
    :size="size"
    :resizable="{
      onResize,
    }"
    @close="onClose"
  >
    <p>Drag the edge to resize the drawer</p>
    <p>Current size: {{ size }}px</p>
  </sue-drawer>
</template>
```
