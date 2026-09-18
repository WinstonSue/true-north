# Controlled

## Description (en-US)

Control panel size with `size` and `onResize`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref<(number | string)[]>(['50%', '50%'])
const enabled = ref(true)

function handleResize(newSizes: number[]) {
  sizes.value = newSizes
}

function handleReset() {
  sizes.value = ['50%', '50%']
}
</script>

<template>
  <sue-flex vertical gap="middle">
    <sue-splitter
      style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
      @resize="handleResize"
    >
      <sue-splitter-panel :size="sizes[0]" :resizable="enabled">
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            First
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
      <sue-splitter-panel :size="sizes[1]">
        <sue-flex justify="center" align="center" style="height: 100%">
          <sue-editable-text type="secondary" :level="5" style="white-space: nowrap">
            Second
          </sue-editable-text>
        </sue-flex>
      </sue-splitter-panel>
    </sue-splitter>
    <sue-flex gap="middle" justify="space-between">
      <sue-switch
        v-model:checked="enabled"
        checked-children="Enabled"
        un-checked-children="Disabled"
      />
      <sue-button @click="handleReset">
        Reset
      </sue-button>
    </sue-flex>
  </sue-flex>
</template>
```
