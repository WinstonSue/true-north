# Customized icon

## Description (en-US)

The icon can be customized to any VueNode.

## Source

```vue
<script setup lang="ts">
import { Smile } from '@lucide/vue'
import { notification } from '@sue/design-web-vue'
import { h } from 'vue'

const [api, ContextHolder] = notification.useNotification()

function openNotification() {
  api.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    icon: h(Smile, { style: { color: '#108ee9' } }),
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
