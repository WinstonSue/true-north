# Asynchronously close

## Description (en-US)

Place custom actions in the content area and close the modal after async work completes.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const loading = ref(false)
const modalText = ref('Content of the modal')
function showModal() {
  open.value = true
}

function handleSubmit() {
  modalText.value = 'The modal will be closed after two seconds'
  loading.value = true
  setTimeout(() => {
    open.value = false
    loading.value = false
  }, 2000)
}
function handleCancel() {
  console.log('Clicked cancel button')
  open.value = false
}
</script>

<template>
  <sue-button type="primary" @click="showModal">
    Open Modal with async logic
  </sue-button>
  <sue-modal
    v-model:open="open"
    title="Title"
    @cancel="handleCancel"
  >
    <p>{{ modalText }}</p>
    <sue-space>
      <sue-button @click="handleCancel">
        Cancel
      </sue-button>
      <sue-button type="primary" :loading="loading" @click="handleSubmit">
        Submit
      </sue-button>
    </sue-space>
  </sue-modal>
</template>
```
