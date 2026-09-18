# Hooks usage (recommended)

## Description (en-US)

Use `message.useMessage` to get `contextHolder` with context accessible issue. Please note that, we recommend to use top level registration instead of `message` static method, because static method cannot consume context, and ConfigProvider data will not work.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function info() {
  messageApi.info('Hello, Antdv Next!')
}
</script>

<template>
  <ContextHolder />
  <sue-button type="primary" @click="info">
    Display normal message
  </sue-button>
</template>
```
