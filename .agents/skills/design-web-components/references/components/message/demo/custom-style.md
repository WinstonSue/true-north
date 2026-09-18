# Customized style

## Description (en-US)

The `style` and `class` are available to customize Message.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function success() {
  messageApi.open({
    type: 'success',
    content: 'This is a prompt message with custom class and style',
    class: 'custom-message',
    style: {
      marginTop: '20vh',
    },
  })
}
</script>

<template>
  <ContextHolder />
  <sue-button @click="success">
    Customized style
  </sue-button>
</template>
```
