# Closable

## Description (en-US)

To show close button.

## Source

```vue
<script setup lang="ts">
function onClose(e: MouseEvent) {
  console.log(e, 'I was closed.')
}
</script>

<template>
  <sue-alert
    title="Warning Title"
    type="warning"
    :closable="{ 'aria-label': 'close' }"
    @close="onClose"
  />
  <br>
  <sue-alert
    title="Success Title"
    type="success"
    :closable="{ 'aria-label': 'close' }"
    @close="onClose"
  />
  <br>
  <sue-alert
    title="Info Title"
    type="info"
    :closable="{ 'aria-label': 'close' }"
    @close="onClose"
  />
  <br>
  <sue-alert
    title="Error Title"
    type="error"
    :closable="{ 'aria-label': 'close' }"
    @close="onClose"
  />
</template>
```
