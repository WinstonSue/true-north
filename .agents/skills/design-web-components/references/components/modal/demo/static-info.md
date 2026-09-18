# Static Method

## Description (en-US)

Static methods cannot consume Context provided by ConfigProvider. When enable `layer`, they may also cause style errors. Please use hooks version or `App` provided instance first.

## Source

```vue
<script setup lang="ts">
import { Modal } from '@sue/design-web-vue'
import { h } from 'vue'

function info() {
  Modal.info({
    title: 'This is a notification message',
    content: h('div', [
      h('p', 'some messages...some messages...'),
      h('p', 'some messages...some messages...'),
    ]),
    onOk() {},
  })
}

function success() {
  Modal.success({
    content: 'some messages...some messages...',
  })
}

function error() {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...',
  })
}

function warning() {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  })
}
</script>

<template>
  <sue-space wrap>
    <sue-button @click="info">
      Info
    </sue-button>
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
