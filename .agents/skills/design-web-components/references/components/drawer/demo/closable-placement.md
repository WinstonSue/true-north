# Closable placement

## Description (en-US)

Drawer close button defaults to the top-right (`end`). Use `closable: { placement: 'start' }` to move it before the title.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
function showDrawer() {
  open.value = true
}
function onClose() {
  open.value = false
}
</script>

<template>
  <sue-button type="primary" @click="showDrawer">
    Open
  </sue-button>
  <sue-drawer
    v-model:open="open"
    title="Drawer Closable Placement"
    :closable="{ placement: 'start' }"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Take a look at the top-left corner...</p>
  </sue-drawer>
</template>
```
