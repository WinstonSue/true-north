# To customize the position of modal

## Description (en-US)

You can use `centered`, `style.top` or other styles to set position of modal dialog.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const modalTopOpen = ref(false)
const modalCenterOpen = ref(false)
</script>

<template>
  <sue-space direction="vertical" :size="24">
    <sue-button type="primary" @click="modalTopOpen = true">
      Display a modal dialog at 20px to Top
    </sue-button>
    <sue-modal
      v-model:open="modalTopOpen"
      title="20px to Top"
      :style="{ top: '20px' }"
      @cancel="modalTopOpen = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </sue-modal>

    <sue-button type="primary" @click="modalCenterOpen = true">
      Vertically centered modal dialog
    </sue-button>
    <sue-modal
      v-model:open="modalCenterOpen"
      title="Vertically centered modal dialog"
      centered
      @cancel="modalCenterOpen = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </sue-modal>
  </sue-space>
</template>
```
