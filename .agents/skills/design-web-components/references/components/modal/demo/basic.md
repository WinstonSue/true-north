# Basic

## Description (en-US)

Basic modal.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
</script>

<template>
  <sue-flex gap="small">
    <sue-button type="primary" @click="open = true">
      Open Modal
    </sue-button>
  </sue-flex>
  <sue-modal
    v-model:open="open"
    title="Basic Modal"
    :closable="{ 'aria-label': 'Custom Close Button' }"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </sue-modal>
</template>
```
