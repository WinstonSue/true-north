# Loading

## Description (en-US)

Set the loading status of Modal.

## Source

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const open = ref(false)
const loading = ref(true)
function showLoading() {
  open.value = true
  loading.value = true

  // Simple loading mock. You should add cleanup logic in real world.
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <sue-button type="primary" @click="showLoading">
    Open Modal
  </sue-button>
  <sue-modal
    v-model:open="open"
    :loading="loading"
    @cancel="open = false"
  >
    <template #title>
      <p>Loading Modal</p>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-modal>
</template>
```
