# To customize the width of modal

## Description (en-US)

Use `width` to set the width of the modal dialog.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const openResponsive = ref(false)
</script>

<template>
  <sue-flex vertical gap="middle" align="flex-start">
    <sue-button type="primary" @click="open = true">
      Open Modal of 1000px width
    </sue-button>
    <sue-modal
      v-model:open="open"
      title="Modal 1000px width"
      centered
      :width="1000"
      @cancel="open = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </sue-modal>

    <sue-button type="primary" @click="openResponsive = true">
      Open Modal of responsive width
    </sue-button>
    <sue-modal
      v-model:open="openResponsive"
      title="Modal responsive width"
      centered
      :width="{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }"
      @cancel="openResponsive = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </sue-modal>
  </sue-flex>
</template>
```
