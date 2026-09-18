# Custom Placement

## Description (en-US)

The Drawer can appear from any edge of the screen.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const placement = shallowRef<DrawerProps['placement']>('left')

function showDrawer() {
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <sue-space>
    <sue-radio-group v-model:value="placement">
      <sue-radio value="top">
        top
      </sue-radio>
      <sue-radio value="right">
        right
      </sue-radio>
      <sue-radio value="bottom">
        bottom
      </sue-radio>
      <sue-radio value="left">
        left
      </sue-radio>
    </sue-radio-group>
    <sue-button type="primary" @click="showDrawer">
      Open
    </sue-button>
  </sue-space>
  <sue-drawer
    v-model:open="open"
    title="Basic Drawer"
    :placement="placement"
    :closable="false"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-drawer>
</template>
```
