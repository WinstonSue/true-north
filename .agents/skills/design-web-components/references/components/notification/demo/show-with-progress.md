# Show with progress

## Description (en-US)

Show progress bar for auto-closing notification.

## Source

```vue
<script lang="ts" setup>
import { notification } from '@sue/design-web-vue'

const [api, ContextHolder] = notification.useNotification()

function openNotification(pauseOnHover: boolean) {
  api.open({
    title: 'Notification Title',
    description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    showProgress: true,
    pauseOnHover,
  })
}
</script>

<template>
  <ContextHolder />
  <sue-space>
    <sue-button type="primary" @click="openNotification(true)">
      Pause on hover
    </sue-button>
    <sue-button type="primary" @click="openNotification(false)">
      Don't pause on hover
    </sue-button>
  </sue-space>
</template>
```
