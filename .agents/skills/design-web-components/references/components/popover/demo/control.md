# Controlling the close of the dialog

## Description (en-US)

Use `open` prop to control the display of the card.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

function hide() {
  open.value = false
}
</script>

<template>
  <sue-popover v-model:open="open" title="Title" trigger="click">
    <template #content>
      <a href="" @click.prevent="hide">Close</a>
    </template>
    <sue-button type="primary">
      Click me
    </sue-button>
  </sue-popover>
</template>
```
