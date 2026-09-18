# Preset size

## Description (en-US)

The default width (or height) of Drawer is `378px`, and there is a preset large size `736px`.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const size = shallowRef<DrawerProps['size']>('default')

function showDefaultDrawer() {
  size.value = 'default'
  open.value = true
}

function showLargeDrawer() {
  size.value = 'large'
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <sue-space>
    <sue-button type="primary" @click="showDefaultDrawer">
      Open Default Size (378px)
    </sue-button>
    <sue-button type="primary" @click="showLargeDrawer">
      Open Large Size (736px)
    </sue-button>
  </sue-space>
  <sue-drawer
    v-model:open="open"
    :title="`${size} Drawer`"
    placement="right"
    :size="size"
    @close="onClose"
  >
    <template #extra>
      <sue-space>
        <sue-button @click="onClose">
          Cancel
        </sue-button>
        <sue-button type="primary" @click="onClose">
          OK
        </sue-button>
      </sue-space>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-drawer>
</template>
```
