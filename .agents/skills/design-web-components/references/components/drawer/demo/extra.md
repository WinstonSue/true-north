# Extra Actions

## Description (en-US)

Extra actions should be placed at corner of drawer in Antdv Next, you can use `extra` prop for that.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from '@sue/design-web-vue'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const placement = shallowRef<DrawerProps['placement']>('right')

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
    :size="500"
    title="Drawer with extra actions"
    :placement="placement"
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
