# Modal or Drawer

## Description (en-US)

Use in Modal and Drawer.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const showModal = shallowRef(false)
const showDrawer = shallowRef(false)
const showDrawer2 = shallowRef(false)

const placeholderStyle = {
  height: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(150, 150, 150, 0.2)',
}
</script>

<template>
  <sue-flex gap="middle">
    <sue-button type="primary" @click="showModal = true">
      Show in Modal
    </sue-button>
    <sue-button type="primary" @click="showDrawer = true">
      Show in Drawer
    </sue-button>
    <sue-button type="primary" @click="showDrawer2 = true">
      Not Show in Drawer
    </sue-button>
  </sue-flex>
  <sue-watermark content="Antdv Next">
    <sue-modal
      v-model:open="showModal"
      destroy-on-hidden
      title="Modal"
      @ok="showModal = false"
      @cancel="showModal = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </sue-modal>
    <sue-drawer
      v-model:open="showDrawer"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </sue-drawer>
  </sue-watermark>
  <sue-watermark content="Antdv Next" :inherit="false">
    <sue-drawer
      v-model:open="showDrawer2"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer2 = false"
    >
      <div :style="placeholderStyle">
        A mock height
      </div>
    </sue-drawer>
  </sue-watermark>
</template>
```
