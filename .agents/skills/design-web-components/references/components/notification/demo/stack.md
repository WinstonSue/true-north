# Stack

## Description (en-US)

Stack configuration, enabled by default. More than 3 notifications will be automatically stacked, and could be changed by `threshold`.

## Source

```vue
<script setup lang="ts">
import { notification } from '@sue/design-web-vue'
import { computed, ref } from 'vue'

const enabled = ref(true)
const threshold = ref(3)

const notificationConfig = computed(() => {
  return {
    stack: enabled.value
      ? {
          threshold: threshold.value,
        }
      : false,
  }
})

const [api, ContextHolder] = notification.useNotification(notificationConfig)

function openNotification() {
  api.open({
    title: 'Notification Title',
    description: Array.from(
      { length: Math.round(Math.random() * 5) + 1 },
      () => 'This is the content of the notification.',
    ).join('\n'),
    duration: false,
  })
}

function toggleEnabled(value: boolean) {
  enabled.value = value
}

function updateThreshold(value: number | null) {
  threshold.value = value || 1
}
</script>

<template>
  <ContextHolder />
  <sue-space size="large">
    <sue-space :style="{ width: '100%' }">
      <span>Enabled:</span>
      <sue-switch :checked="enabled" @change="toggleEnabled" />
    </sue-space>
    <sue-space :style="{ width: '100%' }">
      <span>Threshold:</span>
      <sue-input-number
        :value="threshold"
        :min="1"
        :max="10"
        :step="1"
        :disabled="!enabled"
        @change="updateThreshold"
      />
    </sue-space>
  </sue-space>
  <sue-divider />
  <sue-button type="primary" @click="openNotification">
    Open the notification box
  </sue-button>
</template>
```
