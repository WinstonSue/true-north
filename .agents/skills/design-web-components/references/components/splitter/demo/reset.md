# Double-clicked reset

## Description (en-US)

Double-click the dragger to reset the Splitter.Panel to its default size.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const defaultSizes = ['30%', '40%', '30%']
const sizes = ref<(number | string)[]>([...defaultSizes])

function handleResize(newSizes: number[]) {
  sizes.value = newSizes
}

function handleDoubleClick() {
  sizes.value = [...defaultSizes]
}
</script>

<template>
  <sue-splitter
    style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    @resize="handleResize"
    @dragger-double-click="handleDoubleClick"
  >
    <sue-splitter-panel :size="sizes[0]">
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 1
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>

    <sue-splitter-panel :size="sizes[1]">
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 2
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>

    <sue-splitter-panel :size="sizes[2]">
      <sue-flex justify="center" align="center" style="height: 100%">
        <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
          Panel 3
        </sue-editable-text>
      </sue-flex>
    </sue-splitter-panel>
  </sue-splitter>
</template>
```
