# Imperative open

## Description (en-US)

Open a regular modal imperatively with `Modal.open`, then update and destroy it from the returned instance.

## Source

```vue
<script setup lang="ts">
import { Modal } from '@sue/design-web-vue'

function openModal() {
  const instance = Modal.open({
    title: 'Static Modal',
    content: 'This modal is created by Modal.open().',
  })

  setTimeout(() => {
    instance.update(prevConfig => ({
      ...prevConfig,
      title: 'Updated Static Modal',
      content: 'The content was updated by instance.update().',
    }))
  }, 1000)

  setTimeout(() => {
    instance.destroy()
  }, 2500)
}
</script>

<template>
  <sue-button type="primary" @click="openModal">
    Open with Modal.open
  </sue-button>
</template>
```
