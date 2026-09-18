# Placement

## Description (en-US)

A notification box can appear from the `top` `bottom` `topLeft` `topRight` `bottomLeft` or `bottomRight` of the viewport via `placement`.

## Source

```vue
<script lang="ts" setup>
import { PanelBottom, PanelTop, Radius } from '@lucide/vue'
import { notification } from '@sue/design-web-vue'

const [api, ContextHolder] = notification.useNotification()

function openNotification(placement: string) {
  api.info({
    title: `Notification ${placement}`,
    description: 'This is the content of the notification.',
    placement: placement as any,
  })
}
</script>

<template>
  <ContextHolder />
  <sue-space>
    <sue-button type="primary" @click="openNotification('top')">
      <template #icon>
        <PanelTop />
      </template>
      top
    </sue-button>
    <sue-button type="primary" @click="openNotification('bottom')">
      <template #icon>
        <PanelBottom />
      </template>
      bottom
    </sue-button>
  </sue-space>
  <sue-divider />
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
