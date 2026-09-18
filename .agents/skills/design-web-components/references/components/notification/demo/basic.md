# Static method

## Description (en-US)

Static methods cannot consume Context provided by `ConfigProvider`. When enable `layer`, they may also cause style errors. Please use hooks version or `App` provided instance first.

## Source

```vue
<script setup lang="ts">
import { notification } from '@sue/design-web-vue'

function openNotification() {
  notification.open({
    title: 'Notification Title',
    description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!')
    },
  })
}
</script>

<template>
  <sue-button type="primary" @click="openNotification">
    Open the notification box
  </sue-button>
</template>
```
