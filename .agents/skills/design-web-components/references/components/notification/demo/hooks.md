# Hooks usage (recommended)

## Description (en-US)

Use `notification.useNotification` to get `contextHolder` with context accessible issue. Please note that, we recommend to use top level registration instead of `notification` static method, because static method cannot consume context, and ConfigProvider data will not work.

## Source

```vue
<script setup lang="ts">
import { Radius } from '@lucide/vue'
import { notification } from '@sue/design-web-vue'
import { defineComponent, h, inject, provide, reactive } from 'vue'

const ContextKey = Symbol('notification-context')
const contextValue = reactive({ name: 'Antdv Next' })

provide(ContextKey, contextValue)

const ContextText = defineComponent(() => {
  const context = inject(ContextKey, { name: 'Default' }) as { name: string }
  return () => `Hello, ${context.name}!`
})

const [api, ContextHolder] = notification.useNotification()

// eslint-disable-next-line unused-imports/no-unused-vars
const placements = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const

type NotificationPlacement = (typeof placements)[number]

function openNotification(placement: NotificationPlacement) {
  api.info({
    title: `Notification ${placement}`,
    description: h(ContextText),
    placement,
  })
}
</script>

<template>
  <ContextHolder />
  <sue-space>
    <sue-button type="primary" @click="openNotification('topLeft')">
      <template #icon>
        <Radius />
      </template>
      topLeft
    </sue-button>
    <sue-button type="primary" @click="openNotification('topRight')">
      <template #icon>
        <Radius />
      </template>
      topRight
    </sue-button>
  </sue-space>
  <sue-divider />
  <sue-space>
    <sue-button type="primary" @click="openNotification('bottomLeft')">
      <template #icon>
        <Radius />
      </template>
      bottomLeft
    </sue-button>
    <sue-button type="primary" @click="openNotification('bottomRight')">
      <template #icon>
        <Radius />
      </template>
      bottomRight
    </sue-button>
  </sue-space>
</template>
```
