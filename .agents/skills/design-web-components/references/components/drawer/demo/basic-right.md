# Basic

## Description (en-US)

Basic drawer.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
function showDrawer() {
  open.value = true
}
</script>

<template>
  <sue-button type="primary" @click="showDrawer">
    Open
  </sue-button>
  <sue-drawer
    v-model:open="open"
    title="Basic Drawer"
    :closable="{ 'aria-label': 'Close Button' }"
  >
    <div style="padding: 24px;">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </div>
  </sue-drawer>
</template>
```
