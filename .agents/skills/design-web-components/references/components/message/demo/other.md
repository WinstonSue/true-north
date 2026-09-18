# Other types of message

## Description (en-US)

Messages of success, error and warning types.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

const [messageApi, ContextHolder] = message.useMessage()

function success() {
  messageApi.open({
    type: 'success',
    content: 'This is a success message',
  })
}

function error() {
  messageApi.open({
    type: 'error',
    content: 'This is an error message',
  })
}

function warning() {
  messageApi.open({
    type: 'warning',
    content: 'This is a warning message',
  })
}
</script>

<template>
  <ContextHolder />
  <sue-space>
    <sue-button @click="success">
      Success
    </sue-button>
    <sue-button @click="error">
      Error
    </sue-button>
    <sue-button @click="warning">
      Warning
    </sue-button>
  </sue-space>
</template>
```
