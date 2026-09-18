# Static function

## Description (en-US)

Use `holderRender` to set the `Provider` for the static methods `message`,`modal`,`notification`.

## Source

```vue
<script setup lang="ts">
import { StyleProvider } from '@sue/cssinjs'
import { CircleAlert } from '@lucide/vue'
import { App, ConfigProvider, message, Modal, notification } from '@sue/design-web-vue'
import { h, onBeforeUnmount, onMounted } from 'vue'

function holderRender(children: any) {
  return h(
    StyleProvider,
    { hashPriority: 'high' },
    () => h(
      ConfigProvider,
      { componentSize: 'small' },
      {
        default: () => h(App, { message: { maxCount: 1 }, notification: { maxCount: 1 } }, () => children),
      },
    ),
  )
}

onMounted(() => {
  ;(ConfigProvider as any).config({ holderRender })
})

onBeforeUnmount(() => {
  ;(ConfigProvider as any).config({ holderRender: undefined })
})

function showMessage() {
  message.info('This is a normal message')
}

function showNotification() {
  notification.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}

function showModal() {
  Modal.confirm({
    title: 'Do you want to delete these items?',
    icon: h(CircleAlert),
    content: 'Some descriptions',
  })
}
</script>

<template>
  <sue-space>
    <sue-button type="primary" @click="showMessage">
      message
    </sue-button>
    <sue-button type="primary" @click="showNotification">
      notification
    </sue-button>
    <sue-button type="primary" @click="showModal">
      Modal
    </sue-button>
  </sue-space>
</template>
```
