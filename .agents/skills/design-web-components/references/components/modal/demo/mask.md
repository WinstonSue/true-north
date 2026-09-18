# mask

## Description (en-US)

mask effect.

## Source

```vue
<script setup lang="ts">
import { Modal } from '@sue/design-web-vue'

const modalConfig = {
  title: 'Title',
  content: 'Some contents...',
}

const [modal, ContextHolder] = Modal.useModal()

function showBlur() {
  modal.confirm({ ...modalConfig, mask: { blur: true } })
}

function showDimmed() {
  modal.confirm({ ...modalConfig, mask: { blur: false } })
}

function showNoMask() {
  modal.confirm({ ...modalConfig, mask: false })
}
</script>

<template>
  <sue-space>
    <sue-button @click="showBlur">
      blur
    </sue-button>
    <sue-button @click="showDimmed">
      Dimmed mask
    </sue-button>
    <sue-button @click="showNoMask">
      No mask
    </sue-button>
  </sue-space>
  <ContextHolder />
</template>
```
