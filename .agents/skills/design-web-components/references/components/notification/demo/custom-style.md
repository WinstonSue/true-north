# Customized style

## Description (en-US)

The style and class are available to customize Notification.

## Source

```vue
<script setup lang="ts">
import { notification } from '@sue/design-web-vue'

const [api, ContextHolder] = notification.useNotification()

function openNotification() {
  api.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    class: 'custom-class',
    style: {
      width: '600px',
    },
  })
}
</script>

<template>
  <ContextHolder />
  <sue-button type="primary" @click="openNotification">
    Open the notification box
  </sue-button>
</template>
```
