# Internationalization

## Description (en-US)

Use `ConfigProvider` to set localized Modal copy.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const open = ref(false)

function showModal() {
  open.value = true
}
function hideModal() {
  open.value = false
}
</script>

<template>
  <sue-button type="primary" @click="showModal">
    Modal
  </sue-button>
  <sue-modal
    v-model:open="open"
    title="Modal"
    @cancel="hideModal"
  >
    <p>Bla bla ...</p>
    <p>Bla bla ...</p>
    <p>Bla bla ...</p>
  </sue-modal>
</template>
```
