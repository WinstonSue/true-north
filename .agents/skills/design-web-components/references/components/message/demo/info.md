# Static method

## Description (en-US)

Static methods cannot consume Context provided by `ConfigProvider`. When enable `layer`, they may also cause style errors. Please use hooks version or `App` provided instance first.

## Source

```vue
<script setup lang="ts">
import { message } from '@sue/design-web-vue'

function info() {
  message.info('This is an info message')
}
</script>

<template>
  <sue-button type="primary" @click="info">
    Static Method
  </sue-button>
</template>
```
