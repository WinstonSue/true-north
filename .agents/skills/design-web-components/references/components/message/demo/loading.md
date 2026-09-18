# Message with loading indicator

## Description (en-US)

Display a global loading indicator, which is dismissed by itself asynchronously.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()
function success() {
  const close = messageApi.open({
    type: 'loading',
    content: 'Action in progress..',
    duration: 0,
  })
  // Dismiss manually and asynchronously
  setTimeout(close, 2500)
}
</script>

<template>
  <ContextHolder />
  <sue-button @click="success">
    Display a loading indicator
  </sue-button>
</template>
```
