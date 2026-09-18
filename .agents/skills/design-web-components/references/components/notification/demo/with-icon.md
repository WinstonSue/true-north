# Notification with icon

## Description (en-US)

A notification box with a icon at the left side.

## Source

```vue
<script setup lang="ts">
import { notification } from '@sue/design-web-vue'

const [api, ContextHolder] = notification.useNotification()

type NotificationType = 'success' | 'info' | 'warning' | 'error'

function openNotificationWithIcon(type: NotificationType) {
  api[type]({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}
</script>

<template>
  <ContextHolder />
  <sue-flex gap="8" wrap="wrap">
    <sue-button color="green" variant="outlined" @click="openNotificationWithIcon('success')">
      Success
    </sue-button>
    <sue-button color="blue" variant="outlined" @click="openNotificationWithIcon('info')">
      Info
    </sue-button>
    <sue-button color="yellow" variant="outlined" @click="openNotificationWithIcon('warning')">
      Warning
    </sue-button>
    <sue-button color="red" variant="outlined" @click="openNotificationWithIcon('error')">
      Error
    </sue-button>
  </sue-flex>
</template>
```
