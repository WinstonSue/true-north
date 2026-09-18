# Hover with click popover

## Description (en-US)

The following example shows how to create a popover which can be hovered and clicked.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const clicked = ref(false)
const hovered = ref(false)

function hide() {
  clicked.value = false
  hovered.value = false
}

function handleHoverChange(value: boolean) {
  hovered.value = value
  if (value) {
    clicked.value = false
  }
}

function handleClickChange(value: boolean) {
  clicked.value = value
  if (value) {
    hovered.value = false
  }
}
</script>

<template>
  <sue-popover
    title="Hover title"
    trigger="hover"
    :open="hovered"
    :style="{ width: '500px' }"
    @open-change="handleHoverChange"
  >
    <template #content>
      <div>This is hover content.</div>
    </template>
    <sue-popover
      title="Click title"
      trigger="click"
      :open="clicked"
      @open-change="handleClickChange"
    >
      <template #content>
        <div>
          This is click content.
          <a href="" @click.prevent="hide">Close</a>
        </div>
      </template>
      <sue-button>Hover and click</sue-button>
    </sue-popover>
  </sue-popover>
</template>
```
